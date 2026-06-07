import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, CalendarDays, Users, Receipt, BarChart3,
  MessageCircle, CheckCircle2, ArrowRight, Star, Shield,
  Smartphone, Clock, Menu, X, ChevronDown,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────── */
const features = [
  { icon: CalendarDays,   title: 'Smart Appointments',   color: 'bg-teal-50   text-teal-600',   desc: 'Book and manage appointments in seconds. View daily schedule, update status, no double-booking.' },
  { icon: Users,          title: 'Patient Management',   color: 'bg-indigo-50 text-indigo-600', desc: 'Complete patient profiles with medical history, contact info, and full appointment history.' },
  { icon: MessageCircle,  title: 'WhatsApp Reminders',   color: 'bg-green-50  text-green-600',  desc: 'Auto reminders 24 hr and 2 hr before appointments. Reduces no-shows by up to 60%.' },
  { icon: Receipt,        title: 'Billing & Payments',   color: 'bg-violet-50 text-violet-600', desc: 'Generate bills, track paid and pending, monitor monthly revenue — all in one place.' },
  { icon: BarChart3,      title: 'Analytics Dashboard',  color: 'bg-rose-50   text-rose-600',   desc: 'Real-time charts: revenue trends, busy slots, no-show rates, patient growth.' },
  { icon: Shield,         title: 'Role-Based Access',    color: 'bg-amber-50  text-amber-600',  desc: 'Doctor has full access. Receptionists manage patients & appointments only. Secure.' },
];

const steps = [
  { n: '01', title: 'Register your clinic',  desc: 'Enter clinic name, specialty, and create your admin account in under 2 minutes.' },
  { n: '02', title: 'Add your patients',     desc: 'Add patients with their contact and medical details — takes seconds per patient.' },
  { n: '03', title: 'Book appointments',     desc: 'Select patient, pick a date and time slot. Done in under 30 seconds.' },
  { n: '04', title: 'Sit back & relax',      desc: 'WhatsApp reminders go out automatically. Track everything from your dashboard.' },
];

const testimonials = [
  { name: 'Dr. Ayesha Khan',  role: 'Eye Specialist, Lahore',     text: 'ClinicPulse saved us hours every day. No more paper registers. Patients love the WhatsApp reminders!' },
  { name: 'Dr. Bilal Ahmed',  role: 'General Physician, Karachi',  text: 'Registration took 2 minutes. The dashboard shows everything I need at a glance. Highly recommended.' },
  { name: 'Dr. Sara Mahmood', role: 'Dermatologist, Islamabad',    text: 'Our no-show rate dropped since we started sending WhatsApp reminders. Absolute game changer.' },
];

const stats = [
  { value: '60%',   label: 'Fewer No-Shows' },
  { value: '2 min', label: 'Setup Time'     },
  { value: '24/7',  label: 'Always Online'  },
  { value: 'Rs 0',  label: 'Monthly Cost'   },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate    = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">ClinicPulse</span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {[['#features','Features'],['#how','How it works'],['#reviews','Reviews']].map(([href,label])=>(
                <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">{label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors px-3 py-2">
                Sign In
              </button>
              <button onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm active:scale-[0.98]">
                Get Started Free <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(p => !p)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-5 pt-3 space-y-1 shadow-lg">
            {[['#features','Features'],['#how','How it works'],['#reviews','Reviews']].map(([href,label])=>(
              <a key={href} href={href} onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                {label}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-slate-100 mt-3">
              <button onClick={() => navigate('/login')}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate('/register')}
                className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
                Get Started Free →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-teal-300 whitespace-nowrap">Built for Pakistani Private Clinics</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
            Run your clinic
            <span className="block mt-1" style={{ color: '#2dd4bf' }}>smarter, not harder</span>
          </h1>

          {/* Sub */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            ClinicPulse handles appointments, patients, billing and WhatsApp reminders — so you can focus on your patients.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col xs:flex-row gap-3 justify-center px-2 sm:px-0">
            <button onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-7 py-4 text-[15px] font-bold text-white hover:bg-teal-400 transition-all active:scale-[0.98] shadow-lg shadow-teal-500/25 w-full xs:w-auto">
              Start Free — No Card <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </button>
            <button onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-[15px] font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm w-full xs:w-auto">
              Sign In to Dashboard
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: CheckCircle2, text: '100% Free — Always' },
              { icon: Smartphone,   text: 'Works on All Devices' },
              { icon: Clock,        text: 'Setup in 2 Minutes' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                <Icon className="h-4 w-4 text-teal-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-teal-600">{value}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Everything you need</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">All clinic tools in one place</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              No more juggling spreadsheets, WhatsApp groups, and paper registers.
            </p>
          </div>

          {/* Feature cards — 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:shadow-md hover:border-teal-200 transition-all">
                <div className={`h-11 w-11 rounded-xl ${color} flex items-center justify-center mb-4 flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
      <section id="how" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">

          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Simple process</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Up and running in minutes</h2>
          </div>

          {/* Steps — 1 col mobile, 2 col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-teal-600 flex items-center justify-center">
                  <span className="text-xs font-black text-white">{n}</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════ */}
      <section id="reviews" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Trusted by doctors</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">What clinic owners say</h2>
          </div>

          {/* Cards — 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center uppercase flex-shrink-0">
                    {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            Ready to modernise<br className="hidden sm:block" /> your clinic?
          </h2>
          <p className="text-teal-100 mb-8 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Join clinics across Pakistan using ClinicPulse to manage patients, appointments, and billing — completely free.
          </p>
          <button onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm sm:text-base font-bold text-teal-700 hover:bg-teal-50 transition-all active:scale-[0.98] shadow-lg w-full sm:w-auto justify-center">
            Register Your Clinic Free <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </button>
          <p className="mt-4 text-xs sm:text-sm text-teal-200">No credit card · No contract · Cancel anytime</p>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">

          {/* Mobile: stacked, Desktop: row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">ClinicPulse</span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-slate-400 text-center order-last sm:order-none">
              © {new Date().getFullYear()} ClinicPulse · Built for Pakistani Clinics
            </p>

            {/* Links */}
            <div className="flex items-center gap-5">
              <button onClick={() => navigate('/login')}
                className="text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate('/register')}
                className="text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors">
                Register Free
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
