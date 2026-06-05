import { useState } from 'react';
import Layout from '../../components/common/Layout';
import { Search, Plus, CheckCircle2, Clock, AlertCircle, TrendingUp, Receipt, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const bills = [
  { id: 1, patient: 'Ahmed Khan',     phone: '+92 300 1234567', date: '2025-06-05', type: 'Eye Checkup',       amount: 2000, status: 'paid',    method: 'Cash' },
  { id: 2, patient: 'Sara Malik',     phone: '+92 312 9876543', date: '2025-06-05', type: 'Follow-up',          amount: 1500, status: 'paid',    method: 'Card' },
  { id: 3, patient: 'Bilal Hussain',  phone: '+92 333 1122334', date: '2025-06-05', type: 'New Patient Consult',amount: 3000, status: 'unpaid',  method: '—' },
  { id: 4, patient: 'Fatima Rizvi',   phone: '+92 321 5556677', date: '2025-06-04', type: 'Eye Pressure Test',  amount: 1800, status: 'paid',    method: 'Cash' },
  { id: 5, patient: 'Usman Ali',      phone: '+92 345 9988776', date: '2025-06-03', type: 'Consultation',       amount: 1200, status: 'unpaid',  method: '—' },
  { id: 6, patient: 'Nadia Sheikh',   phone: '+92 333 8899001', date: '2025-05-30', type: 'Glaucoma Screening', amount: 2500, status: 'partial', method: 'Cash' },
];

const statusConfig = {
  paid:    { label: 'Paid',    class: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  unpaid:  { label: 'Unpaid',  class: 'bg-red-100 text-red-600',        icon: AlertCircle },
  partial: { label: 'Partial', class: 'bg-amber-100 text-amber-700',    icon: Clock },
};

export default function BillingList() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = bills.filter(b =>
    b.patient.toLowerCase().includes(search.toLowerCase()) || b.phone.includes(search)
  );

  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const totalUnpaid  = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + b.amount, 0);
  const totalPartial = bills.filter(b => b.status === 'partial').reduce((s, b) => s + b.amount, 0);

  return (
    <Layout title="Billing" subtitle="Track payments and generate invoices">

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Collected',  value: `PKR ${totalRevenue.toLocaleString()}`, icon: TrendingUp,    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Pending Amount',   value: `PKR ${totalUnpaid.toLocaleString()}`,  icon: AlertCircle,   color: 'text-red-600',     bg: 'bg-red-50 border-red-100' },
          { label: 'Partial Payments', value: `PKR ${totalPartial.toLocaleString()}`, icon: Clock,         color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-100' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center gap-4 rounded-2xl border p-5 ${s.bg}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patient…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 shadow-sm transition" />
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Bill
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Patient', 'Service', 'Date', 'Amount', 'Status', 'Method', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(bill => {
                const sc = statusConfig[bill.status];
                const Icon = sc.icon;
                return (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                          {bill.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{bill.patient}</p>
                          <p className="text-xs text-slate-400">{bill.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{bill.type}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{bill.date}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">PKR {bill.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${sc.class}`}>
                        <Icon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{bill.method}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {bill.status === 'unpaid' && (
                          <button onClick={() => toast.success('Payment marked as paid!')}
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
                            Mark Paid
                          </button>
                        )}
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> records</p>
        </div>
      </div>
    </Layout>
  );
}
