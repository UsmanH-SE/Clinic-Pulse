import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI } from '../../services/authService';
import toast from 'react-hot-toast';
import { Activity, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const specialties = [
  { value: 'eye',    label: 'Eye Specialist (Ophthalmologist)' },
  { value: 'gp',     label: 'General Physician (GP)' },
  { value: 'dental', label: 'Dental Clinic' },
  { value: 'skin',   label: 'Skin Specialist (Dermatologist)' },
  { value: 'child',  label: 'Child Specialist (Pediatrician)' },
  { value: 'bone',   label: 'Bone Specialist (Orthopedic)' },
  { value: 'heart',  label: 'Heart Specialist (Cardiologist)' },
  { value: 'other',  label: 'Other' },
];

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export default function RegisterPage() {
  const navigate  = useNavigate();
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  // Each field has its own state — no wrapper component, no shared object
  const [clinicName,    setClinicName]    = useState('');
  const [clinicPhone,   setClinicPhone]   = useState('');
  const [specialty,     setSpecialty]     = useState('gp');
  const [clinicAddress, setClinicAddress] = useState('');
  const [name,          setName]          = useState('');
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!clinicName || !clinicPhone || !clinicAddress || !name || !email || !password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerAPI({
        clinicName, clinicPhone, specialty, clinicAddress, name, email, password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Clinic registered! Welcome, ${data.user.name} 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ClinicPulse</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Register Your Clinic</h1>
          <p className="text-sm text-slate-500 mt-2">Set up your account in under 2 minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Section 1: Clinic Info ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <span className="text-sm font-bold text-teal-600">1</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Clinic Information</p>
                <p className="text-xs text-slate-400">Your clinic's basic details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Clinic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={e => setClinicName(e.target.value)}
                  placeholder=""
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Clinic Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clinicPhone}
                  onChange={e => setClinicPhone(e.target.value)}
                  placeholder=""
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className={inputCls}
                >
                  {specialties.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Clinic Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={clinicAddress}
                  onChange={e => setClinicAddress(e.target.value)}
                  rows={2}
                  placeholder=""
                  className={`${inputCls} resize-none`}
                />
              </div>

            </div>
          </div>

          {/* ── Section 2: Doctor Account ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">2</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Your Admin Account</p>
                <p className="text-xs text-slate-400">Used to login as clinic admin (doctor)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder=""
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder=""
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder=""
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Features */}
          <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
            <p className="text-xs font-bold text-teal-800 mb-3">After registering you can immediately:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Add & manage patients',
                'Book appointments',
                'Add receptionist staff',
                'Track billing & revenue',
                'Send WhatsApp reminders',
                'View clinic analytics',
              ].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <span className="text-xs text-teal-800">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-4 text-sm font-bold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 transition-all duration-150"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating your clinic…
              </>
            ) : (
              'Register & Enter Dashboard →'
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">Sign in</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
