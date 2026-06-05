import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getTodayAPI } from '../../services/appointmentService';
import { CalendarDays, Users, CheckCircle2, XCircle, TrendingUp,
         Clock, ArrowUpRight, Stethoscope, AlertCircle, RefreshCw } from 'lucide-react';

const statusConfig = {
  completed: { label: 'Completed', class: 'bg-emerald-100 text-emerald-700' },
  confirmed:  { label: 'Confirmed', class: 'bg-teal-100 text-teal-700' },
  scheduled:  { label: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
  'no-show':  { label: 'No-Show',   class: 'bg-red-100 text-red-600' },
  cancelled:  { label: 'Cancelled', class: 'bg-slate-100 text-slate-500' },
};

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fetchToday = async () => {
    setLoading(true);
    try {
      const { data } = await getTodayAPI();
      setAppointments(data.appointments || []);
    } catch {
      // silently fail — backend may not be running (demo mode)
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToday(); }, []);

  // Derive stats from real data
  const total     = appointments.length;
  const seen      = appointments.filter(a => a.status === 'completed').length;
  const noShows   = appointments.filter(a => a.status === 'no-show').length;
  const remaining = appointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length;

  const stats = [
    { label: "Today's Appointments", value: total,    sub: `${remaining} remaining`,   icon: CalendarDays,  iconBg: 'bg-teal-500',   ring: 'ring-teal-100' },
    { label: 'Patients Seen',        value: seen,     sub: `${remaining} left today`,  icon: CheckCircle2,  iconBg: 'bg-emerald-500', ring: 'ring-emerald-100' },
    { label: 'No-Shows Today',       value: noShows,  sub: 'Slots wasted',             icon: XCircle,       iconBg: 'bg-red-500',     ring: 'ring-red-100' },
    { label: 'Pending Reminders',    value: remaining,sub: 'Need confirmation',         icon: Clock,         iconBg: 'bg-violet-500',  ring: 'ring-violet-100' },
  ];

  return (
    <Layout title="Dashboard" subtitle={today}>

      {/* Alert banner — only show if no-shows > 0 */}
      {noShows > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">
            <span className="font-bold">{noShows} patient{noShows > 1 ? 's' : ''}</span> did not show up today. Consider sending follow-up reminders.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, iconBg, ring }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow ring-1 ${ring}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">{loading ? '…' : value}</p>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Today's Appointments */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">Today's Schedule</h2>
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-700">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={fetchToday} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button onClick={() => navigate('/appointments/new')}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors">
                  + New
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
                <span className="ml-3 text-sm text-slate-400">Loading…</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-16 text-center">
                <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">No appointments today</p>
                <button onClick={() => navigate('/appointments/new')}
                  className="mt-3 text-sm font-bold text-teal-600 hover:text-teal-700">
                  + Book first appointment
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map(appt => {
                  const sc = statusConfig[appt.status] || statusConfig.scheduled;
                  return (
                    <div key={appt._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                        {appt.patientId?.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{appt.patientId?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{appt.notes || 'No notes'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {appt.timeSlot}
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${sc.class}`}>{sc.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
              <button onClick={() => navigate('/appointments')}
                className="flex items-center justify-center gap-1.5 w-full text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                View all appointments <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Book Appointment', onClick: () => navigate('/appointments/new'), color: 'bg-teal-600 hover:bg-teal-700',   icon: CalendarDays },
                { label: 'Add New Patient',  onClick: () => navigate('/patients/add'),     color: 'bg-indigo-600 hover:bg-indigo-700',icon: Users },
                { label: 'View Billing',     onClick: () => navigate('/billing'),          color: 'bg-violet-600 hover:bg-violet-700',icon: TrendingUp },
              ].map(({ label, onClick, color, icon: Icon }) => (
                <button key={label} onClick={onClick}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${color}`}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Today Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Scheduled',  value: appointments.filter(a => a.status === 'scheduled').length,  color: 'bg-blue-500' },
                { label: 'Confirmed',  value: appointments.filter(a => a.status === 'confirmed').length,  color: 'bg-teal-500' },
                { label: 'Completed',  value: appointments.filter(a => a.status === 'completed').length,  color: 'bg-emerald-500' },
                { label: 'No-Show',    value: noShows,                                                     color: 'bg-red-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-sm font-medium text-slate-600">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{loading ? '—' : value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
