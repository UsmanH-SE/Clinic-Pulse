import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getSlotsAPI, bookAppointmentAPI } from '../../services/appointmentService';
import { getPatients } from '../../services/patientService';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, User, Search, ChevronLeft, CheckCircle2, FileText } from 'lucide-react';

export default function NewAppointment() {
  const navigate = useNavigate();
  const [patients, setPatients]     = useState([]);
  const [slots, setSlots]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [showDropdown, setShowDropdown]   = useState(false);

  const [form, setForm] = useState({
    patientId: '', patientName: '', date: '', timeSlot: '', notes: '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Load patients
  useEffect(() => {
    getPatients({ search: patientSearch, limit: 20 })
      .then(({ data }) => setPatients(data.patients || []))
      .catch(() => {});
  }, [patientSearch]);

  // Load slots when date changes
  useEffect(() => {
    if (!form.date) { setSlots([]); return; }
    setSlotsLoading(true);
    getSlotsAPI(form.date)
      .then(({ data }) => setSlots(data.availableSlots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.date]);

  const selectPatient = (p) => {
    set('patientId', p._id);
    set('patientName', p.name);
    setPatientSearch(p.name);
    setShowDropdown(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.patientId) { toast.error('Please select a patient'); return; }
    if (!form.date)      { toast.error('Please select a date'); return; }
    if (!form.timeSlot)  { toast.error('Please select a time slot'); return; }

    setLoading(true);
    try {
      await bookAppointmentAPI({ patientId: form.patientId, date: form.date, timeSlot: form.timeSlot, notes: form.notes });
      toast.success('Appointment booked successfully! 🎉');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Layout title="New Appointment" subtitle="Book a slot for a patient">

      {/* Back */}
      <button onClick={() => navigate('/appointments')}
        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Appointments
      </button>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient selection */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <User className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Select Patient</p>
                <p className="text-xs text-slate-400">Search for an existing patient</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={patientSearch}
                onChange={e => { setPatientSearch(e.target.value); setShowDropdown(true); set('patientId', ''); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Type patient name…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />

              {showDropdown && patients.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                  {patients.map(p => (
                    <button key={p._id} type="button" onClick={() => selectPatient(p)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                      <div className="h-7 w-7 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center uppercase flex-shrink-0">
                        {p.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {form.patientId && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Selected: {form.patientName}</span>
              </div>
            )}

            <p className="mt-3 text-xs text-slate-400">
              Patient not found?{' '}
              <button type="button" onClick={() => navigate('/patients/add')}
                className="font-bold text-teal-600 hover:text-teal-700">Add new patient →</button>
            </p>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Date & Time</p>
                <p className="text-xs text-slate-400">Choose available slot</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input type="date" value={form.date} min={minDate}
                  onChange={e => { set('date', e.target.value); set('timeSlot', ''); }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
              </div>

              {form.date && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Available Time Slots <span className="text-red-500">*</span>
                  </label>
                  {slotsLoading ? (
                    <div className="flex items-center gap-2 py-4 text-slate-400 text-sm">
                      <div className="h-4 w-4 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
                      Loading slots…
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-slate-400 py-2">No slots available for this date</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <button key={slot} type="button"
                          onClick={() => set('timeSlot', slot)}
                          className={`flex items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                            form.timeSlot === slot
                              ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                          }`}>
                          <Clock className="h-3 w-3" /> {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                <FileText className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Notes (Optional)</p>
                <p className="text-xs text-slate-400">Any special instructions or reason for visit</p>
              </div>
            </div>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={3} placeholder="e.g. Eye checkup, routine visit, follow-up…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm resize-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/appointments')}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 transition-all shadow-sm">
              {loading
                ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Booking…</>
                : <><CalendarDays className="h-4 w-4" /> Confirm Booking</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
