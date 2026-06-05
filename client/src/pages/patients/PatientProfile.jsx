import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { ChevronLeft, Phone, User, Calendar, Clock, Edit2, Plus, FileText, CreditCard } from 'lucide-react';

const patient = {
  id: 1, name: 'Ahmed Khan', phone: '+92 300 1234567', age: 34, gender: 'Male',
  medicalHistory: 'Glaucoma (diagnosed 2023), mild hypertension. Allergic to penicillin.',
  createdAt: '2024-01-15',
};

const visits = [
  { id: 1, date: '2025-06-05', time: '09:00 AM', doctor: 'Dr. Ayesha Siddiqui', type: 'Eye Checkup',    notes: 'IOP: 18mmHg. Continue Timolol drops 0.5%. Review in 3 months.', paid: true,  amount: 2000 },
  { id: 2, date: '2025-03-10', time: '10:30 AM', doctor: 'Dr. Ayesha Siddiqui', type: 'Follow-up',      notes: 'Stable. No progression. Patient compliant with medication.', paid: true,  amount: 1500 },
  { id: 3, date: '2024-12-01', time: '09:30 AM', doctor: 'Dr. Ayesha Siddiqui', type: 'Initial Consult',notes: 'Diagnosed with primary open-angle glaucoma. Started Timolol 0.5%.', paid: true, amount: 3000 },
  { id: 4, date: '2024-09-15', time: '11:00 AM', doctor: 'Dr. Imran Malik',     type: 'GP Checkup',     notes: 'BP: 130/85. Diet advice given. Follow up in 6 weeks.', paid: false, amount: 1200 },
];

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const totalPaid = visits.filter(v => v.paid).reduce((s, v) => s + v.amount, 0);

  return (
    <Layout title="Patient Profile" subtitle={patient.name}>
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Patients
      </button>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Left — Profile card */}
        <div className="xl:col-span-1 space-y-5">

          {/* Main card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-2xl font-black mb-3">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500">{patient.age} years · {patient.gender}</p>
              <span className="mt-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">Active Patient</span>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-5">
              {[
                { icon: Phone,    label: 'Phone',    value: patient.phone },
                { icon: Calendar, label: 'Patient Since', value: patient.createdAt },
                { icon: User,     label: 'Gender',   value: patient.gender },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Edit2 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          </div>

          {/* Medical history */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Medical History</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700">Edit</button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{patient.medicalHistory}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-center">
              <p className="text-2xl font-black text-teal-700">{visits.length}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Total Visits</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center">
              <p className="text-lg font-black text-emerald-700">PKR {(totalPaid/1000).toFixed(1)}K</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Total Paid</p>
            </div>
          </div>
        </div>

        {/* Right — Visit history */}
        <div className="xl:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Visit History</h2>
            <button onClick={() => navigate('/appointments/new')}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Book Appointment
            </button>
          </div>

          <div className="space-y-4">
            {visits.map((visit, idx) => (
              <div key={visit.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{visit.type}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {visit.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {visit.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">PKR {visit.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-bold ${visit.paid ? 'text-emerald-600' : 'text-red-500'}`}>
                      {visit.paid ? '✓ Paid' : '✗ Unpaid'}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-teal-700 mb-2">{visit.doctor}</p>
                <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">{visit.notes}</p>
                  </div>
                </div>
                {idx === 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-700">Latest Visit</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
