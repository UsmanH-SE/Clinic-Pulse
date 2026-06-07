import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { addPatientAPI } from '../../services/patientService';
import { ChevronLeft, User, Phone, Calendar, FileText, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10";

export default function AddPatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', dateOfBirth: '', gender: 'Male', address: '', medicalHistory: '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }

    setLoading(true);
    try {
      const { data } = await addPatientAPI(form);
      toast.success(`Patient "${data.patient?.name}" added successfully! 🎉`);
      navigate('/patients');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add Patient" subtitle="Register a new patient to the system">

      <button onClick={() => navigate('/patients')}
        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Patients
      </button>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <User className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Personal Information</p>
                <p className="text-xs text-slate-400">Basic patient details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name" required>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Ahmed Ali" className={inputClass} />
                </Field>
              </div>

              <Field label="Phone Number" required>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="03XX XXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm transition-all focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10" />
                </div>
              </Field>

              <Field label="Gender" required>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button"
                      onClick={() => set('gender', g)}
                      className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                        form.gender === g
                          ? 'border-teal-500 bg-teal-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Date of Birth">
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm transition-all focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10" />
                </div>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address">
                  <input value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="e.g. House 5, Block A, Lahore"
                    className={inputClass} />
                </Field>
              </div>
            </div>
          </div>

          {/* Medical history */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Medical History</p>
                <p className="text-xs text-slate-400">Any known conditions, allergies, or past treatments</p>
              </div>
            </div>
            <textarea value={form.medicalHistory} onChange={e => set('medicalHistory', e.target.value)}
              rows={4}
              placeholder="e.g. Diabetic, allergic to penicillin, history of hypertension…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm resize-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/patients')}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 transition-all shadow-sm">
              {loading
                ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
                : <><Save className="h-4 w-4" /> Save Patient</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
