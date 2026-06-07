import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { getBillingAPI, markPaidAPI, getSummaryAPI, addBillAPI } from '../../services/billingService';
import { getPatients } from '../../services/patientService';
import { Search, CheckCircle2, Clock, TrendingUp, RefreshCw, Plus, X, Receipt, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BillingList() {
  const [bills, setBills]         = useState([]);
  const [summary, setSummary]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients]   = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ patientId: '', description: '', totalAmount: '', paymentMethod: 'cash' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const [b, s] = await Promise.all([getBillingAPI(params), getSummaryAPI('month')]);
      setBills(b.data.bills || []);
      setSummary(s.data || {});
    } catch { toast.error('Failed to load billing data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const openModal = async () => {
    setShowModal(true);
    try {
      const { data } = await getPatients({ limit: 100 });
      setPatients(data.patients || []);
    } catch {}
  };

  const handleAddBill = async e => {
    e.preventDefault();
    if (!form.patientId || !form.totalAmount) { toast.error('Patient and amount are required'); return; }
    setSubmitting(true);
    try {
      await addBillAPI({ ...form, totalAmount: Number(form.totalAmount) });
      toast.success('Bill added successfully!');
      setShowModal(false);
      setForm({ patientId: '', description: '', totalAmount: '', paymentMethod: 'cash' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add bill');
    } finally { setSubmitting(false); }
  };

  const handleMarkPaid = async (id) => {
    try {
      await markPaidAPI(id, { paymentMethod: 'cash' });
      toast.success('Marked as paid ✅');
      load();
    } catch { toast.error('Failed to mark paid'); }
  };

  const filtered = bills.filter(b =>
    b.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: 'This Month',   value: `Rs ${(summary.totalRevenue || 0).toLocaleString()}`,  icon: TrendingUp,  bg: 'bg-teal-500',    ring: 'ring-teal-100' },
    { label: 'Paid',         value: `Rs ${(summary.paidRevenue   || 0).toLocaleString()}`,  icon: CheckCircle2, bg: 'bg-emerald-500', ring: 'ring-emerald-100' },
    { label: 'Pending',      value: `Rs ${(summary.unpaidRevenue || 0).toLocaleString()}`,  icon: Clock,       bg: 'bg-amber-500',   ring: 'ring-amber-100' },
    { label: 'Total Bills',  value: summary.totalBills || 0,                                 icon: Receipt,     bg: 'bg-indigo-500',  ring: 'ring-indigo-100' },
  ];

  return (
    <Layout title="Billing" subtitle="Revenue and payment records">

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {statCards.map(({ label, value, icon: Icon, bg, ring }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm ring-1 ${ring}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} mb-3`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xl font-black text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patient or description…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />
        </div>
        <div className="relative">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all">
            <option value="all">All Bills</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
        <button onClick={load} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button onClick={openModal}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Bill
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
            <span className="text-sm text-slate-400">Loading bills…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Receipt className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No billing records found</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Patient', 'Description', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(bill => (
                    <tr key={bill._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center uppercase flex-shrink-0">
                            {bill.patientId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                          </div>
                          <p className="font-semibold text-slate-900">{bill.patientId?.name || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-[180px] truncate">{bill.description || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-[12px]">
                        {bill.date ? new Date(bill.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">Rs {(bill.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {bill.status !== 'paid' && (
                          <button onClick={() => handleMarkPaid(bill._id)}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
                            <CheckCircle2 className="h-3 w-3" /> Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filtered.map(bill => (
                <div key={bill._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{bill.patientId?.name || 'Unknown'}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {bill.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">{bill.description || '—'}</p>
                    <p className="text-sm font-bold text-slate-900">Rs {(bill.totalAmount || 0).toLocaleString()}</p>
                  </div>
                  {bill.status !== 'paid' && (
                    <button onClick={() => handleMarkPaid(bill._id)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> Mark as Paid
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900">Add New Bill</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient <span className="text-red-500">*</span></label>
                <select value={form.patientId} onChange={e => set('patientId', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all">
                  <option value="">Select patient…</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <input value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="e.g. Consultation fee, Medicine, Tests"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount (Rs) <span className="text-red-500">*</span></label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Method</label>
                <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 transition-all">
                  {submitting
                    ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Adding…</>
                    : 'Add Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
