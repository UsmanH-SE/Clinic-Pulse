import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, Users, Receipt,
  BarChart3, Settings, LogOut, Activity, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard',    roles: ['admin', 'receptionist'] },
  { to: '/appointments',icon: CalendarDays,    label: 'Appointments', roles: ['admin', 'receptionist'] },
  { to: '/patients',    icon: Users,           label: 'Patients',     roles: ['admin', 'receptionist'] },
  { to: '/billing',     icon: Receipt,         label: 'Billing',      roles: ['admin', 'receptionist'] },
  { to: '/analytics',   icon: BarChart3,       label: 'Analytics',    roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1a2744 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/30">
          <Activity className="h-5 w-5 text-teal-400" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-white tracking-wide">ClinicPulse</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Smart Clinic</p>
        </div>
      </div>

      {/* Clinic badge */}
      <div className="mx-4 mt-4 rounded-xl bg-white/5 px-4 py-3 border border-white/8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-400 mb-1">Clinic</p>
        <p className="text-sm font-semibold text-white truncate">{user?.clinicName || 'My Clinic'}</p>
        <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          user?.role === 'admin' ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'
        }`}>
          {user?.role === 'admin' ? '⚡ Admin' : '🖥 Receptionist'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Menu</p>
        {filtered.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-teal-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
