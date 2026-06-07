import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getAppointmentsAPI, updateStatusAPI, deleteAppointmentAPI } from '../../services/appointmentService';
import toast from 'react-hot-toast';
import { CalendarDays, Plus, Clock, Search, RefreshCw, Trash2, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['scheduled', 'confirmed', 'completed', 'no-show', 'cancelled'];

const statusStyle = {
  completed: 'bg-emerald-100 text-emerald-700',
  confirmed:  'bg-teal-100   text-teal-700',
  scheduled:  'bg-blue-100   text-blue-600',
  'no-show':  'bg-red-100    text-red-600',
  cancelled:  'bg-slate-100  text-slate-500',
};

export default function AppointmentsList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (dateFilter) params.date = dateFilter;
      const { data } = await getAppointmentsAPI(params);
      setAppointments(data.appointments || []);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter, dateFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatusAPI(id, { status });
      toast.success(`Status updated to ${status}`);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await deleteAppointmentAPI(id);
      toast.success('Appointment deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = appointments.filter(a =>
    a.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.timeSlot?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Appointments" subtitle="Manage and track all appointments">

      {/* Toolbar */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patient name or time…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />
        </div>

        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />

        <div className="relative">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>

        <button onClick={() => navigate('/appointments/new')}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> New Appointment
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
            <span className="text-sm text-slate-400">Loading appointments…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No appointments found</p>
            <button onClick={() => navigate('/appointments/new')}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700">
              <Plus className="h-3.5 w-3.5" /> Book one now
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Patient', 'Date', 'Time', 'Status', 'Notes', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(appt => (
                    <tr key={appt._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 text-[11px] font-bold flex items-center justify-center uppercase flex-shrink-0">
                            {appt.patientId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{appt.patientId?.name || 'Unknown'}</p>
                            <p className="text-[11px] text-slate-400">{appt.patientId?.phone || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {appt.date ? new Date(appt.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="h-3 w-3" /> {appt.timeSlot}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <select value={appt.status}
                          onChange={e => handleStatusChange(appt._id, e.target.value)}
                          className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-bold cursor-pointer focus:ring-2 focus:ring-teal-500/20 ${statusStyle[appt.status] || statusStyle.scheduled}`}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[12px] max-w-[160px] truncate">{appt.notes || '—'}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleDelete(appt._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filtered.map(appt => (
                <div key={appt._id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{appt.patientId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {appt.timeSlot} ·{' '}
                        {appt.date ? new Date(appt.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize flex-shrink-0 ${statusStyle[appt.status] || statusStyle.scheduled}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select value={appt.status}
                      onChange={e => handleStatusChange(appt._id, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 bg-white">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => handleDelete(appt._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} appointment{filtered.length !== 1 ? 's' : ''} shown</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {appointments.filter(a => a.status === 'completed').length} completed</span>
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> {appointments.filter(a => a.status === 'no-show').length} no-show</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
