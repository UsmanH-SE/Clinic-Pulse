import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { CalendarDays, Clock, Search, Filter, Plus, MoreHorizontal, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const appointments = [
  { id: 1, patient: 'Ahmed Khan',     phone: '+92 300 1234567', type: 'Eye Checkup',       date: '2025-06-05', time: '09:00 AM', status: 'completed', by: 'Patient' },
  { id: 2, patient: 'Sara Malik',     phone: '+92 312 9876543', type: 'Follow-up',          date: '2025-06-05', time: '09:30 AM', status: 'completed', by: 'Receptionist' },
  { id: 3, patient: 'Bilal Hussain',  phone: '+92 333 1122334', type: 'New Patient',        date: '2025-06-05', time: '10:00 AM', status: 'confirmed', by: 'Patient' },
  { id: 4, patient: 'Fatima Rizvi',   phone: '+92 321 5556677', type: 'Eye Pressure Test',  date: '2025-06-05', time: '10:30 AM', status: 'scheduled', by: 'Receptionist' },
  { id: 5, patient: 'Usman Ali',      phone: '+92 345 9988776', type: 'Consultation',       date: '2025-06-05', time: '11:00 AM', status: 'no-show',   by: 'Patient' },
  { id: 6, patient: 'Zara Siddiqui', phone: '+92 301 6677889', type: 'General Checkup',    date: '2025-06-05', time: '11:30 AM', status: 'scheduled', by: 'Patient' },
  { id: 7, patient: 'Hassan Raza',    phone: '+92 311 4455667', type: 'Eye Examination',    date: '2025-06-06', time: '09:00 AM', status: 'scheduled', by: 'Receptionist' },
  { id: 8, patient: 'Nadia Sheikh',   phone: '+92 333 8899001', type: 'Glaucoma Screening', date: '2025-06-06', time: '09:30 AM', status: 'scheduled', by: 'Patient' },
];

const statusConfig = {
  completed: { label: 'Completed', class: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  confirmed:  { label: 'Confirmed', class: 'bg-teal-100 text-teal-700',     icon: CheckCircle2 },
  scheduled:  { label: 'Scheduled', class: 'bg-blue-100 text-blue-700',     icon: Clock },
  'no-show':  { label: 'No-Show',   class: 'bg-red-100 text-red-600',       icon: XCircle },
  cancelled:  { label: 'Cancelled', class: 'bg-slate-100 text-slate-500',   icon: XCircle },
};

const filters = ['All', 'Scheduled', 'Confirmed', 'Completed', 'No-Show', 'Cancelled'];

export default function AppointmentsList() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = appointments.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) ||
                        a.phone.includes(search) || a.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || a.status === activeFilter.toLowerCase().replace('-', '-');
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="Appointments" subtitle="Manage and track all clinic appointments">

      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient, type…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 shadow-sm" />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        <button onClick={() => navigate('/appointments/new')}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> New Appointment
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === f
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {f}
            {f === 'All' && <span className="ml-1.5">({appointments.length})</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Patient', 'Type', 'Date', 'Time', 'Status', 'Booked By', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(appt => {
                const sc = statusConfig[appt.status];
                const Icon = sc.icon;
                return (
                  <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                          {appt.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{appt.patient}</p>
                          <p className="text-xs text-slate-400">{appt.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{appt.type}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{appt.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {appt.time}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${sc.class}`}>
                        <Icon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        appt.by === 'Patient' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>{appt.by}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {appointments.length} appointments</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Previous</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
