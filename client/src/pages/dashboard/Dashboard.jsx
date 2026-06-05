import Layout from '../../components/common/Layout';
import {
  CalendarDays, Users, CheckCircle2, XCircle,
  TrendingUp, Clock, ArrowUpRight, MoreHorizontal,
  Stethoscope, AlertCircle
} from 'lucide-react';

const stats = [
  { label: "Today's Appointments", value: '12', change: '+3 vs yesterday', icon: CalendarDays, color: 'teal',    bg: 'bg-teal-50',    ring: 'ring-teal-100',  iconBg: 'bg-teal-500',   trend: 'up' },
  { label: 'Patients Seen',        value: '8',  change: '4 remaining',      icon: CheckCircle2, color: 'emerald', bg: 'bg-emerald-50', ring: 'ring-emerald-100',iconBg: 'bg-emerald-500',trend: 'up' },
  { label: 'No-Shows Today',       value: '2',  change: '↓ from 5 avg',     icon: XCircle,      color: 'red',     bg: 'bg-red-50',     ring: 'ring-red-100',   iconBg: 'bg-red-500',    trend: 'down' },
  { label: 'Revenue Today',        value: 'PKR 18,500', change: '+12% this week', icon: TrendingUp, color: 'violet', bg: 'bg-violet-50', ring: 'ring-violet-100', iconBg: 'bg-violet-500', trend: 'up' },
];

const todayAppointments = [
  { id: 1, time: '09:00 AM', name: 'Ahmed Khan',    type: 'Eye Checkup',    status: 'completed', avatar: 'AK' },
  { id: 2, time: '09:30 AM', name: 'Sara Malik',    type: 'Follow-up',       status: 'completed', avatar: 'SM' },
  { id: 3, time: '10:00 AM', name: 'Bilal Hussain', type: 'New Patient',     status: 'confirmed', avatar: 'BH' },
  { id: 4, time: '10:30 AM', name: 'Fatima Rizvi',  type: 'Eye Pressure Test',status: 'scheduled', avatar: 'FR' },
  { id: 5, time: '11:00 AM', name: 'Usman Ali',     type: 'Consultation',    status: 'no-show',   avatar: 'UA' },
  { id: 6, time: '11:30 AM', name: 'Zara Siddiqui', type: 'General Checkup', status: 'scheduled', avatar: 'ZS' },
];

const recentPatients = [
  { name: 'Ahmed Khan',    phone: '+92 300 1234567', visits: 4, lastVisit: 'Today' },
  { name: 'Sara Malik',    phone: '+92 312 9876543', visits: 2, lastVisit: 'Today' },
  { name: 'Nadia Sheikh',  phone: '+92 333 5556677', visits: 7, lastVisit: 'Yesterday' },
  { name: 'Kamran Butt',   phone: '+92 321 1122334', visits: 1, lastVisit: '3 days ago' },
];

const statusConfig = {
  completed: { label: 'Completed', class: 'bg-emerald-100 text-emerald-700' },
  confirmed:  { label: 'Confirmed', class: 'bg-teal-100 text-teal-700' },
  scheduled:  { label: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
  'no-show':  { label: 'No-Show',   class: 'bg-red-100 text-red-600' },
  cancelled:  { label: 'Cancelled', class: 'bg-slate-100 text-slate-500' },
};

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout title="Dashboard" subtitle={today}>

      {/* Alert banner */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm font-medium text-amber-800">
          <span className="font-bold">2 patients</span> have not confirmed for today. Reminder SMS will be sent automatically in 2 hours.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ label, value, change, icon: Icon, bg, ring, iconBg, trend }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ring-1 ${ring}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">{value}</p>
            <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              <ArrowUpRight className={`h-3 w-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {change}
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Today's Appointments — 2 cols */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">Today's Appointments</h2>
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-700">{todayAppointments.length}</span>
              </div>
              <a href="/appointments/new" className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors">
                + New
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {todayAppointments.map(appt => {
                const sc = statusConfig[appt.status];
                return (
                  <div key={appt.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                      {appt.avatar}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{appt.name}</p>
                      <p className="text-xs text-slate-500">{appt.type}</p>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {appt.time}
                    </div>
                    {/* Status */}
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${sc.class}`}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
              <a href="/appointments" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                View all appointments <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Book Appointment', href: '/appointments/new', icon: CalendarDays, color: 'bg-teal-600 hover:bg-teal-700' },
                { label: 'Add New Patient',  href: '/patients/add',     icon: Users,        color: 'bg-indigo-600 hover:bg-indigo-700' },
                { label: 'Record Payment',   href: '/billing',          icon: TrendingUp,   color: 'bg-violet-600 hover:bg-violet-700' },
              ].map(({ label, href, icon: Icon, color }) => (
                <a key={label} href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${color}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Patients</h3>
              </div>
              <a href="/patients" className="text-xs font-semibold text-teal-600 hover:text-teal-700">View all</a>
            </div>
            <div className="divide-y divide-slate-100">
              {recentPatients.map(p => (
                <div key={p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.lastVisit} · {p.visits} visits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
