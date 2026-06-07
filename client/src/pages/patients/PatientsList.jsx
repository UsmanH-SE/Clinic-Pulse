import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getPatients } from '../../services/patientService';
import { Search, Plus, Phone, Calendar, Eye, Users, RefreshCw } from 'lucide-react';

export default function PatientsList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [total, setTotal]       = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPatients({ search, limit: 50 });
      setPatients(data.patients || []);
      setTotal(data.total || 0);
    } catch { setPatients([]); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const genderBadge = g => ({
    Male:   'bg-blue-100 text-blue-700',
    Female: 'bg-pink-100 text-pink-700',
    Other:  'bg-slate-100 text-slate-600',
  }[g] || 'bg-slate-100 text-slate-500');

  return (
    <Layout title="Patients" subtitle={`${total} patient${total !== 1 ? 's' : ''} registered`}>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all" />
        </div>
        <button onClick={load}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button onClick={() => navigate('/patients/add')}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Patient
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-2">
          <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
          <span className="text-sm text-slate-400">Loading patients…</span>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-24 text-center">
          <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400 mb-1">
            {search ? 'No patients match your search' : 'No patients registered yet'}
          </p>
          <p className="text-xs text-slate-300 mb-4">Start by adding your first patient</p>
          <button onClick={() => navigate('/patients/add')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
            <Plus className="h-4 w-4" /> Add Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map(p => (
            <div key={p._id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer"
              onClick={() => navigate(`/patients/${p._id}`)}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center uppercase flex-shrink-0">
                    {p.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${genderBadge(p.gender)}`}>
                      {p.gender}
                    </span>
                  </div>
                </div>
                <Eye className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{p.phone || '—'}</span>
                </div>
                {p.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>DOB: {new Date(p.dateOfBirth).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Added {new Date(p.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[11px] font-semibold text-teal-600 group-hover:underline">View profile →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
