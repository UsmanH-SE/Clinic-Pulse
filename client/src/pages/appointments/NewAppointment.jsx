import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getSlotsAPI, bookAppointmentAPI } from '../../services/appointmentService';
import { getPatients } from '../../services/patientService';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, Search, ChevronLeft, CheckCircle2, User, Phone } from 'lucide-react';

export default function NewAppointment() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(1);
  const [patients, setPatients]       = useState([]);
  const [patSearch, setPatSearch]     = useState('');
  const [selectedPat, setSelectedPat] = useState(null);
  const [slots, setSlots]             = useState({ all: [], available: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [form, setForm] = useState({ date: '', timeSlot: '', notes: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Fetch patients for search
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await getPatients({ search: patSearch });
        setPatients(data.patients || []);
      } catch { /* silent */ }
    };
    fetchPatients();
  }, [patSearch]);

  // Fetch slots when date changes
  useEffect(() => {
    if (!form.date) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      set('timeSlot', '');
      try {
        const { data } = await getSlotsAPI(form.date);
        setSlots({ all: data.allSlots || [], available: data.available || [] });
      } catch {
        toast.error('Could not load slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [form.date]);

  const handleSubmit = async () => {
    if (!selectedPat || !form.date || !form.timeSlot) {
      toast.error('Please complete all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await bookAppointmentAPI({
        patientId:  selectedPat._id,
        date:       form.date,
        timeSlot:   form.timeSlot,
        notes:      form.notes,
        createdBy:  'receptionist',
      });
      toast.success('Appointment booked! WhatsApp confirmation sent.');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="New Appointment" subtitle="Book a new appointment for a patient">

      <button onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-0">
        {['Select Patient', 'Date & Slot', 'Confirm'].map((label, i) => {
          const n = i + 1; const done = step > n; const active = step === n;
          return (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done ? 'bg-teal-600 text-white' : active ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-200 text-slate-500'
              }`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : n}
              </div>
              <span className={`ml-2 text-sm font-semibold ${active ? 'text-teal-700' : done ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
              {i < 2 && <div className={`mx-4 h-px w-16 ${step > n ? 'bg-teal-500' : 'bg-slate-200'}`} />}
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl space-y-5">

        {/* ── STEP 1: Select Patient ── */}
        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Search Patient</h2>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={patSearch} onChange={e => setPatSearch(e.target.value)}
                placeholder="Type name or phone number…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition" />
            </div>

            {/* Patient results */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {patients.length === 0 && patSearch && (
                <div className="py-6 text-center text-sm text-slate-400">
                  No patients found.{' '}
                  <button onClick={() => navigate('/patients/add')} className="font-bold text-teal-600 hover:underline">
                    Add new patient
                  </button>
                </div>
              )}
              {patients.map(p => (
                <button key={p._id} onClick={() => setSelectedPat(p)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                    selectedPat?._id === p._id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                  }`}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.phone} · {p.age ? `${p.age} yrs` : ''} · {p.gender || ''}</p>
                  </div>
                  {selectedPat?._id === p._id && <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />}
                </button>
              ))}
            </div>

            {selectedPat && (
              <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-teal-800">
                  Selected: <span className="font-black">{selectedPat.name}</span> ({selectedPat.phone})
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => navigate('/patients/add')}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                + New Patient
              </button>
              <button onClick={() => { if (!selectedPat) { toast.error('Please select a patient'); return; } setStep(2); }}
                className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Date & Slot ── */}
        {step === 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Select Date & Time</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Appointment Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="date" value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('date', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition" />
              </div>
            </div>

            {form.date && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Available Time Slots
                  {loadingSlots && <span className="ml-2 text-xs font-normal text-slate-400">Loading…</span>}
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
                  </div>
                ) : slots.all.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No slots configured. Ask admin to set working hours.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.all.map(slot => {
                      const isBooked   = !slots.available.includes(slot);
                      const isSelected = form.timeSlot === slot;
                      return (
                        <button key={slot} disabled={isBooked}
                          onClick={() => set('timeSlot', slot)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                            isSelected ? 'bg-teal-600 text-white shadow-sm' :
                            isBooked   ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through' :
                                         'border border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
                          }`}>
                          <Clock className="h-3 w-3" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  {slots.available.length} of {slots.all.length} slots available
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Reason for visit, symptoms, doctor instructions…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                ← Back
              </button>
              <button onClick={() => { if (!form.date || !form.timeSlot) { toast.error('Select date and time'); return; } setStep(3); }}
                className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
                Review →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Confirm Appointment</h2>

            <div className="space-y-3 rounded-xl bg-slate-50 p-5">
              {[
                ['Patient', selectedPat?.name],
                ['Phone',   selectedPat?.phone],
                ['Date',    form.date],
                ['Time',    form.timeSlot],
                ['Notes',   form.notes || 'None'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start justify-between border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-slate-500 w-20">{label}</span>
                  <span className="text-sm font-semibold text-slate-900 text-right flex-1">{val}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-teal-800 font-medium">
                WhatsApp confirmation will be sent to <span className="font-black">{selectedPat?.phone}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                ← Edit
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 transition-colors">
                {submitting ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Booking…</>
                ) : '✓ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
