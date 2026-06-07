import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Activity } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #0d4f47 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/30">
            <Activity className="h-5 w-5 text-teal-400" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">ClinicPulse</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-5">
            Smart clinic<br />
            <span style={{ color: '#2dd4bf' }}>management.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xs">
            Appointments, patients, billing and WhatsApp reminders — all in one place.
          </p>

          {/* 3 feature points */}
          {[
            { n: '01', text: 'Book & manage appointments in seconds' },
            { n: '02', text: 'Auto WhatsApp reminders cut no-shows by 60%' },
            { n: '03', text: 'Real-time analytics & revenue tracking' },
          ].map(f => (
            <div key={f.n} className="flex items-start gap-4 mb-5">
              <span className="text-xs font-bold text-teal-400 mt-0.5 w-6 flex-shrink-0">{f.n}</span>
              <p className="text-sm text-slate-300">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[['60%', 'Less No-Shows'], ['1000+', 'Clinics'], ['Free', 'WhatsApp']].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xl font-black text-teal-400">{v}</p>
              <p className="text-[11px] text-slate-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ClinicPulse</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-8">Enter your credentials to access your clinic</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="doctor@clinic.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-150 focus:border-teal-500 focus:shadow-none focus:ring-3 focus:ring-teal-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-150 focus:border-teal-500 focus:shadow-none focus:ring-3 focus:ring-teal-500/10"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 transition-all duration-150 mt-2">
              {loading
                ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Signing in…</>
                : 'Sign in to Dashboard'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">New to ClinicPulse?</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Register link */}
          <Link to="/register"
            className="flex items-center justify-center w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-all duration-150 shadow-sm">
            Register your clinic →
          </Link>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} ClinicPulse · Built for Pakistani Clinics
          </p>
        </div>
      </div>
    </div>
  );
}
