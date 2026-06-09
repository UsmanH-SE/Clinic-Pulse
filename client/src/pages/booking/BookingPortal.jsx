import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Activity, Search, MapPin, Phone, Calendar, Clock, CheckCircle2, ArrowLeft, ArrowRight, User, Loader2, ChevronLeft } from 'lucide-react';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
const api  = axios.create({ baseURL: `${BASE}/api/public` });

// ─── helpers ──────────────────────────────────────────────────────────────────

const specialtyLabel = {
  eye:    'Eye Specialist',
  gp:     'General Physician',
  dental: 'Dental Clinic',
  skin:   'Skin Specialist',
  child:  'Child Specialist',
  bone:   'Bone Specialist',
  heart:  'Heart Specialist',
  other:  'Clinic',
};

const specialtyColor = {
  eye:    'bg-blue-100 text-blue-700',
  gp:     'bg-teal-100 text-teal-700',
  dental: 'bg-indigo-100 text-indigo-700',
  skin:   'bg-pink-100 text-pink-700',
  child:  'bg-amber-100 text-amber-700',
  bone:   'bg-slate-100 text-slate-700',
  heart:  'bg-rose-100 text-rose-700',
  other:  'bg-gray-100 text-gray-600',
};

function getAvailableDates() {
  const dates = [];
  const now   = new Date();
  const start = now.getHours() >= 20 ? 1 : 0;
  for (let i = start; i < start + 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function displayDate(d) {
  return d.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' });
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20";

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingPortal() {
  const { clinicId: paramClinicId } = useParams();
  const [searchParams]              = useSearchParams();
  const urlClinicId                 = paramClinicId || searchParams.get('clinic');

  const [step, setStep]             = useState(urlClinicId ? 2 : 1);

  // Step 1 — clinic search
  const [query,          setQuery]          = useState('');
  const [results,        setResults]        = useState([]);
  const [searching,      setSearching]      = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [loadingClinic,  setLoadingClinic]  = useState(false);

  // Step 2 — date + slot
  const [dates]        = useState(getAvailableDates);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Step 3 — patient info
  const [patientName,  setPatientName]  = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes,        setNotes]        = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  // Step 4 — done
  const [booking, setBooking] = useState(null);

  // Load clinic by ID from URL
  useEffect(() => {
    if (!urlClinicId) return;
    setLoadingClinic(true);
    api.get(`/clinics/${urlClinicId}`)
      .then(({ data }) => { setSelectedClinic(data.clinic); setStep(2); })
      .catch(() => toast.error('Clinic not found'))
      .finally(() => setLoadingClinic(false));
  }, [urlClinicId]);

  // Clinic search with debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get('/clinics/search', { params: { name: query } });
        setResults(data.clinics || []);
      } catch { setResults([]); }
      finally   { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  // Load slots when date changes
  useEffect(() => {
    if (!selectedDate || !selectedClinic) return;
    setLoadingSlots(true);
    setSelectedSlot('');
    api.get('/slots', { params: { clinicId: selectedClinic._id, date: formatDate(selectedDate) } })
      .then(({ data }) => setSlots(data.availableSlots || []))
      .catch(() => { toast.error('Could not load slots'); setSlots([]); })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedClinic]);

  const pickClinic = useCallback((clinic) => {
    setSelectedClinic(clinic);
    setQuery('');
    setResults([]);
    setStep(2);
  }, []);

  const handleBook = async e => {
    e.preventDefault();
    if (!patientName.trim())  { toast.error('Please enter your name'); return; }
    if (!patientPhone.trim() || patientPhone.length < 10) { toast.error('Please enter a valid phone number'); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post('/book', {
        clinicId:     selectedClinic._id,
        patientName:  patientName.trim(),
        patientPhone: patientPhone.trim(),
        date:         formatDate(selectedDate),
        timeSlot:     selectedSlot,
        notes:        notes.trim(),
      });
      setBooking(data.appointment);
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingClinic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">ClinicPulse</span>
          </Link>
          {step > 1 && step < 4 && !urlClinicId && (
            <button
              onClick={() => { setStep(s => s - 1); setSelectedSlot(''); }}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-16">

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {[
              { n: 1, label: 'Find Clinic' },
              { n: 2, label: 'Pick Slot'   },
              { n: 3, label: 'Your Info'   },
            ].map(({ n, label }, i, arr) => (
              <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0
                    ${step === n ? 'bg-teal-600 text-white' : step > n ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-500'}`}>
                    {step > n ? <CheckCircle2 className="h-4 w-4" /> : n}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step === n ? 'text-teal-700' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded ${step > n ? 'bg-teal-400' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Find Clinic ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-1">Find Your Clinic</h1>
            <p className="text-sm text-slate-500 mb-5">Search by clinic name or doctor name</p>

            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. Dr. Ahmed Eye Clinic, City Dental…"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3.5 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                autoFocus
              />
              {searching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 animate-spin" />
              )}
            </div>

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map(clinic => (
                  <button
                    key={clinic._id}
                    onClick={() => pickClinic(clinic)}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{clinic.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-500 truncate">{clinic.address}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-500">{clinic.phone}</p>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${specialtyColor[clinic.specialty] || specialtyColor.other}`}>
                        {specialtyLabel[clinic.specialty] || 'Clinic'}
                      </span>
                    </div>
                    <div className="flex items-center justify-end mt-2 gap-1 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold">Book now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && !searching && results.length === 0 && (
              <div className="text-center py-10">
                <Search className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">No clinics found for "{query}"</p>
                <p className="text-xs text-slate-400 mt-1">Try a different name or ask your clinic for their booking link</p>
              </div>
            )}

            {query.length < 2 && (
              <div className="text-center py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 mx-auto mb-4">
                  <Activity className="h-8 w-8 text-teal-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Type at least 2 letters to search</p>
                <p className="text-xs text-slate-400 mt-1">We'll find the clinic and show you available slots</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Pick Date & Slot ────────────────────────────── */}
        {step === 2 && selectedClinic && (
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                <Activity className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{selectedClinic.name}</p>
                <p className="text-xs text-slate-500 truncate">{selectedClinic.address}</p>
              </div>
              <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${specialtyColor[selectedClinic.specialty] || specialtyColor.other}`}>
                {specialtyLabel[selectedClinic.specialty] || 'Clinic'}
              </span>
            </div>

            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" /> Select Date
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {dates.map(d => {
                const isSel = selectedDate && formatDate(d) === formatDate(selectedDate);
                return (
                  <button
                    key={formatDate(d)}
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-center transition-all border
                      ${isSel
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'}`}
                  >
                    <p className="text-[10px] font-semibold uppercase opacity-80">
                      {d.toLocaleDateString('en-PK', { weekday: 'short' })}
                    </p>
                    <p className="text-base font-black leading-tight">{d.getDate()}</p>
                    <p className="text-[10px] font-semibold opacity-80">
                      {d.toLocaleDateString('en-PK', { month: 'short' })}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <>
                <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" /> Select Time Slot
                  <span className="text-[11px] font-normal text-slate-400">— {displayDate(selectedDate)}</span>
                </h2>

                {loadingSlots ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <Loader2 className="h-5 w-5 text-teal-500 animate-spin" />
                    <span className="text-sm text-slate-400">Loading available slots…</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                    <Clock className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-400">No available slots for this date</p>
                    <p className="text-xs text-slate-400 mt-1">Please try a different date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl py-2.5 text-xs font-bold transition-all border
                          ${selectedSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-700'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}

                {selectedSlot && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 text-sm font-bold text-white hover:bg-teal-700 transition-all active:scale-[0.98] shadow-sm"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* ── STEP 3: Patient Info ────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-1">Your Details</h1>
            <p className="text-sm text-slate-500 mb-5">Almost done! Just enter your info below</p>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-teal-800">{selectedClinic?.name}</p>
                  <p className="text-xs text-teal-600">{displayDate(selectedDate)} · {selectedSlot}</p>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Change
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Ali Hassan"
                  className={inputCls}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={e => setPatientPhone(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className={inputCls}
                />
                <p className="text-[11px] text-slate-400 mt-1">Used to identify your appointments</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Reason / Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Eye checkup, follow-up visit, tooth pain…"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 text-sm font-bold text-white hover:bg-teal-700 transition-all active:scale-[0.98] shadow-sm disabled:opacity-60"
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</>
                  : <><CheckCircle2 className="h-4 w-4" /> Confirm Appointment</>}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 4: Success ──────────────────────────────────────── */}
        {step === 4 && booking && (
          <div className="text-center py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Booked!</h1>
            <p className="text-sm text-slate-500 mb-6">Your appointment has been confirmed</p>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-left mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Appointment Details</h3>
              <div className="space-y-3">
                {[
                  { icon: Activity, color: 'bg-teal-50', iconColor: 'text-teal-600', label: 'Clinic',   value: booking.clinicName   },
                  { icon: User,     color: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Patient', value: booking.patientName  },
                  { icon: Calendar, color: 'bg-amber-50',  iconColor: 'text-amber-600',  label: 'Date & Time', value: `${booking.date} · ${booking.timeSlot}` },
                ].map(({ icon: Icon, color, iconColor, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">{label}</p>
                      <p className="text-sm font-bold text-slate-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-5">Please arrive 5–10 minutes early and bring your ID.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setStep(2);
                  setSelectedSlot('');
                  setPatientName('');
                  setPatientPhone('');
                  setNotes('');
                  setBooking(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Book Another
              </button>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
