import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { CalendarDays, Clock, User, Phone, Search, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const doctors = [
  { id: 1, name: 'Dr. Ayesha Siddiqui', specialty: 'Eye Specialist',    available: true },
  { id: 2, name: 'Dr. Imran Malik',      specialty: 'General Physician', available: true },
  { id: 3, name: 'Dr. Raza Ahmed',       specialty: 'Eye Specialist',    available: false },
];

const timeSlots = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM',
];
const bookedSlots = ['09:00 AM', '10:30 AM', '03:00 PM'];

export default function NewAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ patientSearch: '', patientName: '', patientPhone: '', doctorId: '', date: '', timeSlot: '', notes: '' });
  const [isNewPatient, setIsNewPatient] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    toast.success('Appointment booked! WhatsApp confirmation sent.');
    navigate('/appointments');
  };

  const selectedDoctor = doctors.find(d => d.id === Number(form.doctorId));

  return (
    <Layout title="New Appointment" subtitle="Book a new appointment for a patient">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Appointments
      </button>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-0">
        {['Patient', 'Doctor & Slot', 'Confirm'].map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
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

      <div className="max-w-2xl">

        {/* STEP 1 — Patient */}
        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Select Patient</h2>

            {/* Search existing */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Search existing patient</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input value={form.patientSearch} onChange={e => set('patientSearch', e.target.value)}
                  placeholder="Search by name or phone number…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* New patient toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 hover:border-teal-400 hover:bg-teal-50 transition-colors">
              <input type="checkbox" checked={isNewPatient} onChange={e => setIsNewPatient(e.target.checked)} className="h-4 w-4 accent-teal-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Add new patient</p>
                <p className="text-xs text-slate-500">Register a new patient on the spot</p>
              </div>
            </label>

            {isNewPatient && (
              <div className="space-y-4 rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input value={form.patientName} onChange={e => set('patientName', e.target.value)}
                        placeholder="Ahmed Khan"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input value={form.patientPhone} onChange={e => set('patientPhone', e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(2)}
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Doctor & Slot */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Doctor */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Select Doctor</h2>
              <div className="grid grid-cols-1 gap-3">
                {doctors.map(d => (
                  <label key={d.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                    Number(form.doctorId) === d.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                  } ${!d.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="doctor" value={d.id} disabled={!d.available}
                      checked={Number(form.doctorId) === d.id}
                      onChange={() => set('doctorId', String(d.id))}
                      className="h-4 w-4 accent-teal-600" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                      {d.name.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.specialty}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${d.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {d.available ? 'Available' : 'Unavailable'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date & Slots */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Select Date & Time</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Appointment Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('date', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => {
                    const booked = bookedSlots.includes(slot);
                    const selected = form.timeSlot === slot;
                    return (
                      <button key={slot} disabled={booked} onClick={() => set('timeSlot', slot)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                          selected ? 'bg-teal-600 text-white shadow-sm' :
                          booked   ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through' :
                                     'border border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
                        }`}>
                        <Clock className="h-3 w-3" />
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                  placeholder="Add any relevant notes about the appointment…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition resize-none" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">Review →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirm */}
        {step === 3 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Confirm Appointment</h2>
            <div className="space-y-3 rounded-xl bg-slate-50 p-5">
              {[
                ['Patient',   isNewPatient ? form.patientName || '—' : 'Existing Patient'],
                ['Doctor',    selectedDoctor?.name || '—'],
                ['Specialty', selectedDoctor?.specialty || '—'],
                ['Date',      form.date || '—'],
                ['Time',      form.timeSlot || '—'],
                ['Notes',     form.notes || 'None'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start justify-between">
                  <span className="text-sm font-medium text-slate-500 w-24">{label}</span>
                  <span className="text-sm font-semibold text-slate-900 text-right flex-1">{val}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-teal-800 font-medium">A WhatsApp confirmation message will be automatically sent to the patient.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Edit</button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">✓ Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
