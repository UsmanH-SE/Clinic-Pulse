import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { getOverviewAPI, getTrendsAPI, getBusySlotsAPI } from '../../services/analyticsService';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, Users, XCircle, Clock, ArrowUpRight, RefreshCw } from 'lucide-react';

const COLORS = ['#059669', '#dc2626', '#94a3b8', '#0d9488'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-bold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs text-slate-600">
          <span className="font-semibold" style={{ color: p.color }}>{p.name}:</span>{' '}
          {p.name === 'revenue' ? `PKR ${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const [overview, setOverview]   = useState(null);
  const [trends, setTrends]       = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ovRes, trRes, bsRes] = await Promise.all([
        getOverviewAPI(),
        getTrendsAPI(),
        getBusySlotsAPI(),
      ]);
      setOverview(ovRes.data.overview   || null);
      setTrends(trRes.data.trends       || []);
      setBusySlots(bsRes.data.busySlots || []);
    } catch {
      // Keep empty state — charts show "no data" gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Build pie data from overview
  const pieTotals = overview
    ? overview.weekAppointments
    : 1;
  const statusPie = overview ? [
    { name: 'Completed', value: overview.completedThisWeek,                                              color: '#059669' },
    { name: 'No-Show',   value: overview.noShowsThisWeek,                                               color: '#dc2626' },
    { name: 'Other',     value: Math.max(0, overview.weekAppointments - overview.completedThisWeek - overview.noShowsThisWeek), color: '#94a3b8' },
  ] : [];

  const kpis = overview ? [
    { label: 'Week Revenue',       value: `PKR ${overview.weekRevenue.toLocaleString()}`, change: 'This week',       icon: TrendingUp, color: 'bg-teal-600' },
    { label: 'Week Appointments',  value: overview.weekAppointments,                      change: `Today: ${overview.todayAppointments}`, icon: Clock, color: 'bg-indigo-600' },
    { label: 'No-Show Rate',       value: overview.noShowRate,                            change: 'This week',       icon: XCircle,    color: 'bg-red-500' },
    { label: 'Total Patients',     value: overview.totalPatients,                         change: 'All time',        icon: Users,      color: 'bg-violet-600' },
  ] : [];

  const maxSlot = busySlots.length ? busySlots[0].count : 1;

  return (
    <Layout title="Analytics" subtitle="Clinic performance overview and trends">

      {/* Refresh button */}
      <div className="mb-6 flex justify-end">
        <button onClick={fetchAll}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
          <span className="ml-3 text-sm text-slate-400">Loading analytics…</span>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {kpis.map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
                <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </p>
              </div>
            ))}
            {kpis.length === 0 && (
              <div className="col-span-4 rounded-2xl border border-dashed border-slate-300 py-10 text-center">
                <p className="text-sm text-slate-400">No data yet — start booking appointments to see analytics.</p>
              </div>
            )}
          </div>

          {/* Charts row 1 */}
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Daily revenue bar chart */}
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Daily Revenue & Appointments (7 days)</h3>
              <p className="text-xs text-slate-400 mb-5">Real data from your MongoDB database</p>
              {trends.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">No appointment data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trends} barSize={28} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="revenue" fill="#0d9488" radius={[6,6,0,0]} />
                    <Bar dataKey="appointments" name="appointments" fill="#6366f1" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Status pie */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">Appointment Status (This Week)</h3>
              {statusPie.every(s => s.value === 0) ? (
                <div className="flex items-center justify-center h-[160px] text-sm text-slate-400">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {statusPie.map((_, i) => <Cell key={i} fill={statusPie[i].color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="mt-4 space-y-2">
                {statusPie.map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-medium text-slate-600">{s.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Revenue line trend */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">Revenue Trend (7 days)</h3>
              {trends.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" name="revenue" stroke="#0d9488" strokeWidth={2.5} dot={{ fill: '#0d9488', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Busiest slots */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">Busiest Time Slots</h3>
              {busySlots.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">No booking data yet</div>
              ) : (
                <div className="space-y-3">
                  {busySlots.map(s => (
                    <div key={s.slot} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-semibold text-slate-600 text-right flex-shrink-0">{s.slot}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(s.count / maxSlot) * 100}%`,
                            backgroundColor: s.count >= maxSlot * 0.8 ? '#0d9488' : s.count >= maxSlot * 0.5 ? '#6366f1' : '#94a3b8',
                          }} />
                      </div>
                      <span className="w-8 text-xs font-bold text-slate-700">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
              {busySlots.length > 0 && (
                <p className="mt-4 text-xs text-slate-400">
                  Peak slot: <span className="font-semibold text-teal-600">{busySlots[0]?.slot}</span> with {busySlots[0]?.count} bookings
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
