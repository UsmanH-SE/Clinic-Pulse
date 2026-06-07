import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { getTodayAPI } from '../../services/appointmentService';
import { CalendarDays, Users, CheckCircle2, Clock, TrendingUp, Plus, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const statusStyle = {
  completed: 'bg-emerald-100 text-emerald-700',
  confirmed:  'bg-teal-100   text-teal-700',
  scheduled:  'bg-blue-100   text-blue-700',
  'no-show':  'bg-red-100    text-red-600',
  cancelled:  'bg-slate-100  text-slate-500',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const fetchToday = async () => {
    setLoading(true);
    try {
      const { data } = await getTodayAPI();
      setAppointments(data.appointments || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchToday(); }, []);

  const total     = appointments.length;
  const seen      = appointments.filter(a => a.status === 'completed').length;
  const noShows   = appointments.filter(a => a.status === 'no-show').length;
  const remaining = appointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length;

  const stats = [
    { label: "Today's Appointments", value: total,     icon: CalendarDays,  bg: 'bg-teal-500',    ring: 'ring-teal-100',    sub: `${remaining} remaining` },
    { label: 'Patients Seen',        value: seen,      icon: CheckCircle2,  bg: 'bg-emerald-500', ring: 'ring-emerald-100', sub: 'Completed today' },
    { label: 'No-Shows',             value: noShows,   icon: AlertCircle,   bg: 'bg-rose-500',    ring: 'ring-rose-100',    sub: 'Missed visits' },
    { label: 'Pending',              value: remaining, icon: Clock,         bg: 'bg-violet-500',  ring: 'ring-violet-100',  sub: 'Still upcoming' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <Layout title="Dashboard" subtitle={today}>

      {/* Welcome bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900">
            Good {greeting}, {user?.name?.split(' ')[0]} 👋
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.clinicName} — here's today's overview
          </p>
        </div>
        <button onClick={fetchToday}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, bg, ring, sub }) => (
          <div key={label}
            className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm ring-1 ${ring} hover:shadow-md transition-shadow`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{loading ? '—' : value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Schedule */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Today's Schedule</h2>
              {!loading && (
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-700">{total}</span>
              )}
            </div>
            <button onClick={() => navigate('/appointments/new')}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700 transition-colors">
              <Plus className="h-3 w-3" /> New
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2">
              <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">No appointments today</p>
              <button onClick={() => navigate('/appointments/new')}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700">
                <Plus className="h-3.5 w-3.5" /> Book first appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {appointments.map(appt => (
                <div key={appt._id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-teal-100 text-teal-700 text-[11px] font-bold flex items-center justify-center uppercase">
                    {appt.patientId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{appt.patientId?.name || 'Unknown'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{appt.notes || 'General consultation'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 flex-shrink-0">
                    <Clock className="h-3 w-3" /> {appt.timeSlot}
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusStyle[appt.status] || statusStyle.scheduled}`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/40">
            <button onClick={() => navigate('/appointments')}
              className="flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View all appointments <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Book Appointment', path: '/appointments/new', color: 'bg-teal-600 hover:bg-teal-700',     icon: CalendarDays },
                { label: 'Add New Patient',  path: '/patients/add',     color: 'bg-indigo-600 hover:bg-indigo-700', icon: Users },
                { label: 'View Billing',     path: '/billing',          color: 'bg-violet-600 hover:bg-violet-700', icon: TrendingUp },
              ].map(({ label, path, color, icon: Icon }) => (
                <button key={label} onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] ${color}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Today at a Glance</h3>
            <div className="space-y-3">
              {[
                { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length, dot: 'bg-blue-500' },
                { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, dot: 'bg-teal-500' },
                { label: 'Completed', value: seen,    dot: 'bg-emerald-500' },
                { label: 'No-Show',   value: noShows, dot: 'bg-rose-500' },
              ].map(({ label, value, dot }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="text-sm text-slate-600 font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{loading ? '—' : value}</span>
                </div>
              ))}
            </div>
            {!loading && total > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Completion rate</span>
                  <span className="text-xs font-bold text-emerald-600">{Math.round((seen / total) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${Math.round((seen / total) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
