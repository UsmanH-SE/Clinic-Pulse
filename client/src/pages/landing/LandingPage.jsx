import { useNavigate } from 'react-router-dom';
import {
  Activity, CalendarDays, Users, Receipt, BarChart3,
  MessageCircle, CheckCircle2, ArrowRight, Star, Shield,
  Smartphone, Clock, TrendingUp, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: CalendarDays,
    title: 'Smart Appointments',
    desc: 'Book and manage appointments in seconds. View daily schedule, update status, and never double-book a slot.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Users,
    title: 'Patient Management',
    desc: 'Complete patient profiles with medical history, contact details, and full appointment & billing history.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Reminders',
    desc: 'Automatic reminders sent to patients 24 hours and 2 hours before their appointment — reduces no-shows by 60%.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Receipt,
    title: 'Billing & Payments',
    desc: 'Generate bills, track paid and pending payments, and monitor monthly revenue — all in one place.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Real-time charts showing revenue trends, busy time slots, no-show rates, and patient growth.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Doctor (admin) has full access. Receptionists can manage patients and appointments only. Secure by design.',
    color: 'bg-amber-50 text-amber-600',
  },
];

const steps = [
  { n: '01', title: 'Register your clinic', desc: 'Enter clinic name, specialty, and create your admin account in 2 minutes.' },
  { n: '02', title: 'Add your patients',    desc: 'Import or add patients one by one with their contact and medical info.' },
  { n: '03', title: 'Book appointments',    desc: 'Select patient, pick a date and time slot — done in under 30 seconds.' },
  { n: '04', title: 'Sit back & relax',     desc: 'WhatsApp reminders go out automatically. Track everything from your dashboard.' },
];

const testimonials = [
  { name: 'Dr. Ayesha Khan',    role: 'Eye Specialist, Lahore',    text: 'ClinicPulse saved us hours every day. No more paper registers. Patients love the WhatsApp reminders!' },
  { name: 'Dr. Bilal Ahmed',    role: 'General Physician, Karachi', text: 'Registration took 2 minutes. The dashboard shows everything I need at a glance. Highly recommended.' },
  { name: 'Dr. Sara Mahmood',   role: 'Dermatologist, Islamabad',   text: 'Our no-show rate dropped significantly since we started sending WhatsApp reminders. Game changer.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">ClinicPulse</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#how" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">How it works</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Reviews</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors px-3 py-2">
                Sign In
              </button>
              <button onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
                Get Started Free <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(p => !p)} className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-slate-100 py-4 space-y-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Features</a>
              <a href="#how"      onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">How it works</a>
              <a href="#testimonials" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Reviews</a>
              <div className="pt-2 flex flex-col gap-2">
                <button onClick={() => navigate('/login')}
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')}
                  className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white">
                  Get Started Free →
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 pt-20 pb-24 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-teal-300">Built for Pakistani Private Clinics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Run your clinic
            <span className="block" style={{ color: '#2dd4bf' }}>smarter, not harder</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            ClinicPulse handles appointments, patients, billing and WhatsApp reminders — so you can focus on what matters: your patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-400 transition-all active:scale-[0.98] shadow-lg shadow-teal-500/25">
              Start Free — No Card Needed <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm">
              Sign In to Dashboard
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {[
              { icon: CheckCircle2, text: '100% Free — Always' },
              { icon: Smartphone,   text: 'Works on Mobile & PC' },
              { icon: Clock,        text: 'Setup in 2 Minutes' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon className="h-4 w-4 text-teal-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-slate-100 bg-slate-50 py-10 px-4">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '60%',    label: 'Fewer No-Shows' },
            { value: '2 min',  label: 'Setup Time' },
            { value: '24/7',   label: 'Always Available' },
            { value: 'Rs 0',   label: 'Monthly Cost' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-teal-600">{value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">All clinic tools in one place</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">No more juggling spreadsheets, WhatsApp groups, and paper registers. ClinicPulse brings it all together.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md hover:border-teal-200 transition-all">
                <div className={`h-11 w-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 px-4 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Simple process</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center">
                  <span className="text-sm font-black text-white">{n}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Trusted by doctors</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">What clinic owners say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center uppercase">
                    {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to modernise your clinic?
          </h2>
          <p className="text-teal-100 mb-8 text-base leading-relaxed">
            Join clinics across Pakistan using ClinicPulse to manage patients, appointments, and billing — completely free.
          </p>
          <button onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-teal-700 hover:bg-teal-50 transition-all active:scale-[0.98] shadow-lg">
            Register Your Clinic Free <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-sm text-teal-200">No credit card • No contract • Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">ClinicPulse</span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} ClinicPulse · Built for Pakistani Private Clinics · All rights reserved
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')}    className="text-xs text-slate-400 hover:text-teal-600 font-medium transition-colors">Sign In</button>
            <button onClick={() => navigate('/register')} className="text-xs text-slate-400 hover:text-teal-600 font-medium transition-colors">Register</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
