import Layout from '../../components/common/Layout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, XCircle, Clock, ArrowUpRight } from 'lucide-react';

const revenueData = [
  { day: 'Mon', revenue: 18500, appointments: 10 },
  { day: 'Tue', revenue: 22000, appointments: 13 },
  { day: 'Wed', revenue: 15000, appointments: 8  },
  { day: 'Thu', revenue: 27500, appointments: 15 },
  { day: 'Fri', revenue: 31000, appointments: 17 },
  { day: 'Sat', revenue: 19500, appointments: 11 },
];

const monthlyData = [
  { month: 'Jan', revenue: 380000 },
  { month: 'Feb', revenue: 420000 },
  { month: 'Mar', revenue: 390000 },
  { month: 'Apr', revenue: 510000 },
  { month: 'May', revenue: 480000 },
  { month: 'Jun', revenue: 133500 },
];

const slotsData = [
  { slot: '9-10am', count: 28 },
  { slot: '10-11am', count: 35 },
  { slot: '11-12pm', count: 22 },
  { slot: '2-3pm', count: 30 },
  { slot: '3-4pm', count: 18 },
  { slot: '4-5pm', count: 12 },
];

const statusPie = [
  { name: 'Completed', value: 68, color: '#059669' },
  { name: 'No-Show',   value: 12, color: '#dc2626' },
  { name: 'Cancelled', value: 8,  color: '#94a3b8' },
  { name: 'Scheduled', value: 12, color: '#0d9488' },
];

const COLORS = statusPie.map(s => s.color);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-bold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs text-slate-600">
          <span className="font-semibold" style={{ color: p.color }}>{p.name}:</span>{' '}
          {typeof p.value === 'number' && p.name === 'revenue' ? `PKR ${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const weekRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const weekAppointments = revenueData.reduce((s, d) => s + d.appointments, 0);

  return (
    <Layout title="Analytics" subtitle="Clinic performance overview and trends">

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'This Week Revenue',   value: `PKR ${(weekRevenue/1000).toFixed(0)}K`, change: '+18% vs last week', icon: TrendingUp, color: 'bg-teal-600' },
          { label: 'Total Appointments',  value: weekAppointments,                          change: '+5 vs last week',  icon: Clock,       color: 'bg-indigo-600' },
          { label: 'No-Show Rate',        value: '12%',                                    change: '↓ 3% improved',    icon: XCircle,     color: 'bg-red-500' },
          { label: 'New Patients',        value: '8',                                      change: 'This week',        icon: Users,       color: 'bg-violet-600' },
        ].map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />{change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Revenue bar chart — 2 cols */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Revenue (This Week)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Total: PKR {weekRevenue.toLocaleString()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="revenue" fill="#0d9488" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5">Appointment Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusPie.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-medium text-slate-600">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Monthly revenue trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="#0d9488" strokeWidth={2.5} dot={{ fill: '#0d9488', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Busiest slots */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5">Busiest Time Slots</h3>
          <div className="space-y-3">
            {slotsData.map(s => (
              <div key={s.slot} className="flex items-center gap-3">
                <span className="w-16 text-xs font-semibold text-slate-600 text-right">{s.slot}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(s.count / 35) * 100}%`, backgroundColor: s.count >= 30 ? '#0d9488' : s.count >= 20 ? '#6366f1' : '#94a3b8' }} />
                </div>
                <span className="w-8 text-xs font-bold text-slate-700">{s.count}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">Peak hours: <span className="font-semibold text-teal-600">10–11am</span> with 35 appointments</p>
        </div>
      </div>
    </Layout>
  );
}
