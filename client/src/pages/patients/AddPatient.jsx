import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { ChevronLeft, User, Phone, Calendar, Users, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', age: '', gender: '', medicalHistory: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    toast.success(`Patient ${form.name} added successfully!`);
    navigate('/patients');
  };

  return (
    <Layout title="Add Patient" subtitle="Register a new patient record">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Patients
      </button>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Personal info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                <User className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition" />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">WhatsApp reminders will be sent to this number</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
                    placeholder="34" min="0" max="120"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                      form.gender === g ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}>
                      <input type="radio" name="gender" value={g} className="sr-only" onChange={() => set('gender', g)} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medical history */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Medical History <span className="text-xs font-normal text-slate-400">(optional)</span></h2>
            </div>
            <textarea value={form.medicalHistory} onChange={e => set('medicalHistory', e.target.value)}
              rows={4} placeholder="Known conditions, allergies, ongoing medications…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
              <Save className="h-4 w-4" /> Save Patient
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
