import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { addStaffAPI, getStaffAPI, toggleStaffAPI } from '../../services/authService';
import { Users, Plus, CheckCircle2, XCircle, Eye, EyeOff, Mail, Lock, User, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';

const roleConfig = {
  admin:        { label: 'Admin (Doctor)',  bg: 'bg-teal-100   text-teal-700',   icon: Shield },
  receptionist: { label: 'Receptionist',   bg: 'bg-indigo-100 text-indigo-700', icon: Users },
};

export default function StaffManagement() {
  const [staff, setStaff]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [submitting, setSub]    = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await getStaffAPI();
      setStaff(data.staff || []);
    } catch { toast.error('Could not load staff'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('All fields are required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSub(true);
    try {
      await addStaffAPI(form);
      toast.success(`${form.name} added as receptionist! ✅`);
      setForm({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add staff');
    } finally { setSub(false); }
  };

  const handleToggle = async (id, name, isActive) => {
    if (!window.confirm(`${isActive ? 'Deactivate' : 'Activate'} ${name}?`)) return;
    try {
      await toggleStaffAPI(id);
      toast.success(`${name} ${isActive ? 'deactivated' : 'activated'}`);
      fetchStaff();
    } catch { toast.error('Failed to update staff status'); }
  };

  const active   = staff.filter(s => s.isActive).length;
  const inactive = staff.filter(s => !s.isActive).length;

  return (
    <Layout title="Staff & Settings" subtitle="Manage clinic staff and access">

      {/* Stats + action */}
      <div className="mb-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-4">
          {[
            { label: 'Total Staff',  value: staff.length, color: 'text-slate-900', bg: 'bg-slate-100' },
            { label: 'Active',       value: active,       color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Inactive',     value: inactive,     color: 'text-red-600',    bg: 'bg-red-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-xl ${bg} px-4 py-3 text-center min-w-[72px]`}>
              <p className={`text-xl font-black ${color}`}>{loading ? '—' : value}</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add Receptionist
        </button>
      </div>

      {/* How it works */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">How it works:</span> You (Admin/Doctor) create accounts for your receptionists.
          They log in with the email & password you set. Receptionists can manage patients & appointments
          but <span className="font-bold">cannot</span> access analytics, billing summary, or add new staff.
        </p>
      </div>

      {/* Staff table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
            <span className="text-sm text-slate-400">Loading staff…</span>
          </div>
        ) : staff.length === 0 ? (
          <div className="py-24 text-center">
            <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No staff yet</p>
            <button onClick={() => setShowForm(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700">
              <Plus className="h-3.5 w-3.5" /> Add your first receptionist
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Staff Member', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.map(s => {
                    const cfg = roleConfig[s.role] || roleConfig.receptionist;
                    const RoleIcon = cfg.icon;
                    return (
                      <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center uppercase">
                              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <p className="font-semibold text-slate-900">{s.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500">{s.email}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${cfg.bg}`}>
                            <RoleIcon className="h-3 w-3" /> {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {s.isActive
                              ? <><CheckCircle2 className="h-3 w-3" /> Active</>
                              : <><XCircle className="h-3 w-3" /> Inactive</>}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {s.role !== 'admin' ? (
                            <button onClick={() => handleToggle(s._id, s.name, s.isActive)}
                              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold border transition-colors ${
                                s.isActive
                                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}>
                              {s.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Owner account</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {staff.map(s => {
                const cfg = roleConfig[s.role] || roleConfig.receptionist;
                return (
                  <div key={s._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center uppercase">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.email}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {s.role !== 'admin' && (
                      <button onClick={() => handleToggle(s._id, s.name, s.isActive)}
                        className={`w-full rounded-lg py-2 text-xs font-bold border transition-colors ${
                          s.isActive
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}>
                        {s.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Add Receptionist Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Receptionist</h3>
                <p className="text-xs text-slate-400 mt-0.5">They'll use these credentials to log in</p>
              </div>
              <button onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Sara Malik"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="receptionist@clinic.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 transition-all">
                  {submitting
                    ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Adding…</>
                    : 'Add Receptionist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
