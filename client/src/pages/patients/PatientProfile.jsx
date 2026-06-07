import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getPatientHistory } from '../../services/patientService';
import { ChevronLeft, Phone, User, Calendar, Clock, CalendarDays, Receipt, FileText, AlertCircle } from 'lucide-react';

const statusStyle = {
  completed: 'bg-emerald-100 text-emerald-700',
  confirmed:  'bg-teal-100   text-teal-700',
  scheduled:  'bg-blue-100   text-blue-600',
  'no-show':  'bg-red-100    text-red-600',
  cancelled:  'bg-slate-100  text-slate-500',
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient]           = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState('appointments');

  useEffect(() => {
    getPatientHistory(id)
      .then(({ data }) => {
        setPatient(data.patient);
        setAppointments(data.appointments || []);
        setBills(data.bills || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Layout title="Patient Profile">
      <div className="flex items-center justify-center py-24 gap-2">
        <div className="h-5 w-5 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading profile…</span>
      </div>
    </Layout>
  );

  if (!patient) return (
    <Layout title="Patient Profile">
      <div className="py-24 text-center">
        <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-semibold">Patient not found</p>
        <button onClick={() => navigate('/patients')}
          className="mt-3 text-sm font-bold text-teal-600 hover:text-teal-700">← Go back</button>
      </div>
    </Layout>
  );

  const totalBilled = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalPaid   = bills.filter(b => b.status === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <Layout title="Patient Profile" subtitle={patient.name}>

      <button onClick={() => navigate('/patients')}
        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Patients
      </button>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-teal-100 text-teal-700 text-xl font-black flex items-center justify-center uppercase flex-shrink-0">
            {patient.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">{patient.name}</h2>
                <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  patient.gender === 'Male' ? 'bg-blue-100 text-blue-700' : patient.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {patient.gender}
                </span>
              </div>
              <button onClick={() => navigate('/appointments/new')}
                className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
                <CalendarDays className="h-4 w-4" /> Book Appointment
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Phone,    label: 'Phone',    value: patient.phone || '—' },
                { icon: Calendar, label: 'DOB',      value: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                { icon: User,     label: 'Address',  value: patient.address || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                  <Icon className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm text-slate-700 font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {patient.medicalHistory && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 p-3">
                <FileText className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Medical History</p>
                  <p className="text-sm text-amber-800 mt-0.5">{patient.medicalHistory}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Appointments', value: appointments.length, icon: CalendarDays, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Billed',  value: `Rs ${totalBilled.toLocaleString()}`, icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Paid',    value: `Rs ${totalPaid.toLocaleString()}`,   icon: Receipt, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
            <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-lg font-black text-slate-900">{value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            { key: 'appointments', label: 'Appointments', count: appointments.length },
            { key: 'billing',      label: 'Billing',      count: bills.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-colors ${
                tab === t.key
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {tab === 'appointments' && (
          appointments.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarDays className="h-9 w-9 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-semibold">No appointments yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {appointments.map(a => (
                <div key={a._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 w-28 flex-shrink-0">
                    <Clock className="h-3.5 w-3.5" /> {a.timeSlot}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{a.notes || 'General consultation'}</p>
                    <p className="text-[11px] text-slate-400">
                      {a.date ? new Date(a.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${statusStyle[a.status] || statusStyle.scheduled}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'billing' && (
          bills.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt className="h-9 w-9 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-semibold">No billing records</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {bills.map(b => (
                <div key={b._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{b.description || 'Consultation fee'}</p>
                    <p className="text-[11px] text-slate-400">
                      {b.date ? new Date(b.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <p className="font-bold text-slate-900">Rs {(b.totalAmount || 0).toLocaleString()}</p>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${b.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
