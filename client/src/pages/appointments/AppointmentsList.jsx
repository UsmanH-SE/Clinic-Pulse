import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getAppointmentsAPI, updateStatusAPI, deleteAppointmentAPI } from '../../services/appointmentService';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, Search, Filter, Plus, MoreHorizontal,
         CheckCircle2, XCircle, RefreshCw, ChevronDown } from 'lucide-react';

const statusConfig = {
  completed: { label: 'Completed', class: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  confirmed:  { label: 'Confirmed', class: 'bg-teal-100 text-teal-700',     icon: CheckCircle2 },
  scheduled:  { label: 'Scheduled', class: 'bg-blue-100 text-blue-700',     icon: Clock },
  'no-show':  { label: 'No-Show',   class: 'bg-red-100 text-red-600',       icon: XCircle },
  cancelled:  { label: 'Cancelled', class: 'bg-slate-100 text-slate-500',   icon: XCircle },
};

const filterTabs = ['All', 'Scheduled', 'Confirmed', 'Completed', 'No-Show', 'Cancelled'];

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [dateFilter, setDateFilter]     = useState('');
  const [actionId, setActionId]         = useState(null); // open dropdown id
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFilter)                          params.date   = dateFilter;
      if (activeFilter !== 'All')              params.status = activeFilter.toLowerCase().replace(' ', '-');
      const { data } = await getAppointmentsAPI(params);
      setAppointments(data.appointments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, [activeFilter, dateFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatusAPI(id, { status });
      toast.success(`Appointment marked as ${status}`);
      setActionId(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await deleteAppointmentAPI(id);
      toast.success('Appointment cancelled');
      setActionId(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  // Client-side search filter
  const filtered = appointments.filter(a => {
    if (!search) return true;
    const name  = a.patientId?.name?.toLowerCase()  || '';
    const phone = a.patientId?.phone                 || '';
    const q     = search.toLowerCase();
    return name.includes(q) || phone.includes(q);
  });

  return (
    <Layout title="Appointments" subtitle="Manage and track all clinic appointments">

      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient name or phone…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 shadow-sm transition" />
          </div>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-500 shadow-sm transition" />
          <button onClick={fetchAppointments}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => navigate('/appointments/new')}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> New Appointment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === f ? 'bg-teal-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
            <span className="ml-3 text-sm text-slate-500">Loading appointments…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Patient', 'Date', 'Time', 'Status', 'Notes', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(appt => {
                  const sc   = statusConfig[appt.status] || statusConfig.scheduled;
                  const Icon = sc.icon;
                  return (
                    <tr key={appt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                            {appt.patientId?.name?.split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{appt.patientId?.name || '—'}</p>
                            <p className="text-xs text-slate-400">{appt.patientId?.phone || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{appt.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {appt.timeSlot}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${sc.class}`}>
                          <Icon className="h-3 w-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 max-w-[180px] truncate">
                        {appt.notes || '—'}
                      </td>
                      <td className="px-5 py-4 relative">
                        <button onClick={() => setActionId(actionId === appt._id ? null : appt._id)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                          Actions <ChevronDown className="h-3 w-3" />
                        </button>
                        {actionId === appt._id && (
                          <div className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                            {['confirmed','completed','no-show'].map(s => (
                              <button key={s} onClick={() => handleStatusChange(appt._id, s)}
                                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 capitalize transition-colors">
                                Mark as {s.replace('-', ' ')}
                              </button>
                            ))}
                            <div className="my-1 border-t border-slate-100" />
                            <button onClick={() => handleCancel(appt._id)}
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                              Cancel Appointment
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-400">No appointments found</p>
                      <button onClick={() => navigate('/appointments/new')}
                        className="mt-3 text-sm font-bold text-teal-600 hover:text-teal-700">
                        + Book first appointment
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> appointments
          </p>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {actionId && <div className="fixed inset-0 z-10" onClick={() => setActionId(null)} />}
    </Layout>
  );
}
