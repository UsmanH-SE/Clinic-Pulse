import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Activity, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Clock, BarChart3, Zap } from 'lucide-react';

const features = [
  { icon: Shield, text: 'Secure patient records with role-based access' },
  { icon: Clock,  text: 'Automated WhatsApp reminders cut no-shows by 60%' },
  { icon: BarChart3, text: 'Real-time clinic analytics & revenue tracking' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    demoLogin(role);
    toast.success(`Logged in as ${role === 'admin' ? 'Admin (Dr. Ayesha)' : 'Receptionist (Sara)'}`);
    navigate('/');
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1a2f4e 50%, #0d4f47 100%)' }}>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
          <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/20 ring-1 ring-teal-400/40 backdrop-blur-sm">
            <Activity className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white tracking-wide">ClinicPulse</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/80">Smart Clinic Management</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Run your clinic<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #2dd4bf, #38bdf8)' }}>
                like never before.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Trusted by private clinics across Pakistan — from general physicians to eye specialists. Cut no-shows, automate reminders, track revenue.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-teal-500/15 ring-1 ring-teal-400/20">
                  <Icon className="h-4 w-4 text-teal-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['50K+', 'Clinics in PK'], ['60%', 'Less No-Shows'], ['PKR 3L', 'Saved/Month']].map(([val, label]) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-xl font-black text-teal-400">{val}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">ClinicPulse</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1.5">Sign in to your clinic dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="doctor@clinic.com" autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-xs font-semibold text-teal-600 hover:text-teal-700">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="relative w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              style={{ background: loading ? '#0f766e' : 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3"><span>Quick Demo Access</span></div>
          </div>

          {/* Demo + Real credentials panel */}
          <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Quick Access</p>
            </div>

            {/* Real backend credentials */}
            <div className="rounded-lg bg-white border border-amber-200 px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Real Backend (MongoDB)</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Admin:</span>
                <button type="button" onClick={() => setForm({ email: 'admin@visionclinic.com', password: 'admin123' })}
                  className="text-[11px] font-mono font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 rounded px-2 py-0.5 transition-colors">
                  admin@visionclinic.com / admin123
                </button>
              </div>
            </div>

            {/* Demo buttons (no backend) */}
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors">
                ⚡ Admin Demo
              </button>
              <button type="button" onClick={() => handleDemoLogin('receptionist')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors">
                🖥 Receptionist Demo
              </button>
            </div>
            <p className="text-[10px] text-amber-700 text-center">Demo buttons = no backend needed · Real login needs server running</p>
          </div>

          {/* Patient portal link */}
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4 text-center">
            <p className="text-sm text-slate-600 font-medium">Are you a patient?</p>
            <a href="/book" className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors">
              Book an appointment <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © 2025 ClinicPulse · <span className="font-medium">Secure</span> · <span className="font-medium">HIPAA-Ready</span>
          </p>
        </div>
      </div>
    </div>
  );
}
