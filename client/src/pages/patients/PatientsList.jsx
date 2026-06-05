import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { Search, Plus, Phone, Calendar, Eye, MoreHorizontal, Users } from 'lucide-react';

const patients = [
  { id: 1, name: 'Ahmed Khan',      phone: '+92 300 1234567', age: 34, gender: 'Male',   visits: 4, lastVisit: '2025-06-05', condition: 'Glaucoma' },
  { id: 2, name: 'Sara Malik',      phone: '+92 312 9876543', age: 28, gender: 'Female', visits: 2, lastVisit: '2025-06-05', condition: 'Myopia' },
  { id: 3, name: 'Bilal Hussain',   phone: '+92 333 1122334', age: 45, gender: 'Male',   visits: 1, lastVisit: '2025-06-05', condition: 'New Patient' },
  { id: 4, name: 'Fatima Rizvi',    phone: '+92 321 5556677', age: 52, gender: 'Female', visits: 7, lastVisit: '2025-06-04', condition: 'Diabetic Retinopathy' },
  { id: 5, name: 'Usman Ali',       phone: '+92 345 9988776', age: 41, gender: 'Male',   visits: 3, lastVisit: '2025-06-03', condition: 'Cataract' },
  { id: 6, name: 'Zara Siddiqui',   phone: '+92 301 6677889', age: 22, gender: 'Female', visits: 1, lastVisit: '2025-06-02', condition: 'Eye Allergy' },
  { id: 7, name: 'Hassan Raza',     phone: '+92 311 4455667', age: 38, gender: 'Male',   visits: 5, lastVisit: '2025-05-30', condition: 'Hypertension' },
  { id: 8, name: 'Nadia Sheikh',    phone: '+92 333 8899001', age: 60, gender: 'Female', visits: 9, lastVisit: '2025-05-28', condition: 'Glaucoma' },
];

export default function PatientsList() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) || p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Patients" subtitle="Manage patient records and medical history">

      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, condition…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 shadow-sm" />
          </div>
        </div>
        <button onClick={() => navigate('/patients/add')}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Patient
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Patients', value: patients.length, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100' },
          { label: 'This Month',     value: 3,              color: 'text-indigo-700',bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Active',         value: 6,              color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Follow-ups Due', value: 2,              color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grid of patient cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(patient => (
          <div key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex-shrink-0">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{patient.name}</p>
                  <p className="text-xs text-slate-500">{patient.age} yrs · {patient.gender}</p>
                </div>
              </div>
              <button onClick={e => e.stopPropagation()} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Condition */}
            <div className="mb-4">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{patient.condition}</span>
            </div>

            {/* Details */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Last visit: {patient.lastVisit}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                {patient.visits} total visits
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-400">No patients found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
