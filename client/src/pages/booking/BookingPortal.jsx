import { useState } from 'react';
import { Activity, Phone, Shield, Clock, CheckCircle2, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const doctors = [
  { id: 1, name: 'Dr. Ayesha Siddiqui', specialty: 'Eye Specialist',    experience: '12 yrs', fee: 2000, slots: ['09:00 AM','09:30 AM','11:00 AM','02:30 PM','04:00 PM'] },
  { id: 2, name: 'Dr. Imran Malik',      specialty: 'General Physician', experience: '8 yrs',  fee: 1500, slots: ['10:00 AM','10:30 AM','03:00 PM','04:30 PM'] },
];
const bookedSlots = ['09:00 AM', '10:00 AM'];

const steps = ['Phone', 'Doctor', 'Date & Time', 'Confirm'];

export default function BookingPortal() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ phone: '', otp: '', otpSent: false, doctorId: '', date: '', slot: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const selectedDoctor = doctors.find(d => d.id === Number(form.doctorId));

  const sendOtp = () => {
    if (!form.phone || form.phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    set('otpSent', true);
    toast.success('OTP sent to your WhatsApp!');
  };

  const verifyOtp = () => {
    if (form.otp !== '1234') { toast.error('Invalid OTP. Try 1234 for demo.'); return; }
    setStep(1);
    toast.success('Phone verified!');
  };

  const confirmBooking = () => {
    toast.success('🎉 Appointment booked! WhatsApp confirmation sent.');
    setStep(4);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)' }}>

      {/* Header */}
      <header className="border-b border-white/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">ClinicPulse</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Patient Portal</p>
            </div>
          </div>
          <a href="/login" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Staff Login
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Hero text */}
        {step === 0 && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 mb-4">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              Appointments Available Today
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Book Your Appointment</h1>
            <p className="text-slate-500 max-w-md mx-auto">Fast, easy, and instant confirmation on WhatsApp. No calls needed.</p>
          </div>
        )}

        {/* Step indicator */}
        {step < 4 && (
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                  step > i  ? 'bg-teal-600 text-white' :
                  step === i ? 'bg-teal-600 text-white ring-4 ring-teal-100' :
                               'bg-slate-200 text-slate-500'
                }`}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === i ? 'text-teal-700' : 'text-slate-400'}`}>{label}</span>
                {i < steps.length - 1 && <div className={`h-px w-8 ${step > i ? 'bg-teal-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 0 — Phone + OTP */}
        {step === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Enter your phone number</h2>
            <p className="text-sm text-slate-500 mb-5">We'll send a verification code via WhatsApp</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+92 300 1234567" type="tel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition" />
                </div>
              </div>

              {!form.otpSent ? (
                <button onClick={sendOtp}
                  className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                  Send OTP via WhatsApp <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter OTP</label>
                    <input value={form.otp} onChange={e => set('otp', e.target.value)}
                      placeholder="Enter 4-digit OTP (demo: 1234)" maxLength={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition" />
                  </div>
                  <button onClick={verifyOtp}
                    className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
                    Verify & Continue
                  </button>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-6 pt-5 border-t border-slate-100">
              {[['🔒', 'Secure'], ['⚡', 'Instant'], ['📱', 'WhatsApp']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Select a Doctor</h2>
            {doctors.map(d => (
              <label key={d.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 bg-white transition-all ${
                Number(form.doctorId) === d.id ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-slate-200 hover:border-teal-200'
              }`}>
                <input type="radio" name="doctor" className="sr-only" value={d.id}
                  checked={Number(form.doctorId) === d.id}
                  onChange={() => set('doctorId', String(d.id))} />
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-lg">
                  {d.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-slate-900">{d.name}</p>
                  <p className="text-sm text-slate-500">{d.specialty} · {d.experience} experience</p>
                  <p className="text-sm font-bold text-teal-600 mt-1">PKR {d.fee.toLocaleString()} / visit</p>
                </div>
                <ChevronRight className={`h-5 w-5 transition-colors ${Number(form.doctorId) === d.id ? 'text-teal-600' : 'text-slate-300'}`} />
              </label>
            ))}
            <button onClick={() => { if (!form.doctorId) { toast.error('Please select a doctor'); return; } setStep(2); }}
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Date & Slot */}
        {step === 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Pick Date & Time</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('date', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Available Slots</label>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor?.slots || []).map(slot => {
                  const booked = bookedSlots.includes(slot);
                  return (
                    <button key={slot} disabled={booked} onClick={() => set('slot', slot)}
                      className={`rounded-xl py-3 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        form.slot === slot ? 'bg-teal-600 text-white shadow-sm' :
                        booked  ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through' :
                                  'border border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
                      }`}>
                      <Clock className="h-3 w-3" />
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={() => { if (!form.date || !form.slot) { toast.error('Select date and time'); return; } setStep(3); }}
                className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">Review →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirm */}
        {step === 3 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Confirm Your Booking</h2>
            <div className="space-y-3 rounded-xl bg-slate-50 p-5">
              {[
                ['Doctor',    selectedDoctor?.name],
                ['Specialty', selectedDoctor?.specialty],
                ['Date',      form.date],
                ['Time',      form.slot],
                ['Fee',       `PKR ${selectedDoctor?.fee?.toLocaleString()}`],
                ['Phone',     form.phone],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-slate-200 last:border-0">
                  <span className="text-sm font-medium text-slate-500">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{val}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-teal-800 font-medium">You'll receive a confirmation and reminders on WhatsApp at <span className="font-bold">{form.phone}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Edit</button>
              <button onClick={confirmBooking} className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">✓ Book Appointment</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Appointment Confirmed!</h2>
            <p className="text-slate-500 text-sm mb-6">A confirmation has been sent to your WhatsApp. You'll get reminders 24 hours and 2 hours before your appointment.</p>
            <div className="rounded-xl bg-slate-50 p-4 mb-6 space-y-2">
              <p className="text-sm font-bold text-slate-800">{selectedDoctor?.name}</p>
              <p className="text-sm text-slate-500">{form.date} at {form.slot}</p>
            </div>
            <button onClick={() => { setStep(0); setForm({ phone: '', otp: '', otpSent: false, doctorId: '', date: '', slot: '' }); }}
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
