import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, Users, Receipt,
  BarChart3, Settings, LogOut, Activity, ChevronRight, Menu, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',      roles: ['admin', 'receptionist'] },
  { to: '/appointments', icon: CalendarDays,  label: 'Appointments',   roles: ['admin', 'receptionist'] },
  { to: '/patients',   icon: Users,           label: 'Patients',       roles: ['admin', 'receptionist'] },
  { to: '/billing',    icon: Receipt,         label: 'Billing',        roles: ['admin', 'receptionist'] },
  { to: '/analytics',  icon: BarChart3,       label: 'Analytics',      roles: ['admin'] },
  { to: '/staff',      icon: Settings,        label: 'Staff & Settings', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filtered = navItems.filter(item => item.roles.includes(user?.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 ring-1 ring-teal-400/20 flex-shrink-0">
          <Activity className="h-4 w-4 text-teal-400" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-white tracking-wide">ClinicPulse</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">Smart Clinic</p>
        </div>
      </div>

      {/* Clinic badge */}
      <div className="mx-4 mt-4 rounded-xl bg-white/5 border border-white/8 px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-teal-400 mb-1">Active Clinic</p>
        <p className="text-sm font-semibold text-white truncate leading-snug">{user?.clinicName || 'My Clinic'}</p>
        <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
          user?.role === 'admin' ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'
        }`}>
          {user?.role === 'admin' ? 'Admin' : 'Receptionist'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">Menu</p>
        {filtered.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-teal-500/15 text-white ring-1 ring-teal-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/8 p-4 space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg lg:hidden">
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1a2744 100%)' }}>
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:flex w-60 flex-col"
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1a2744 100%)', boxShadow: '2px 0 20px rgba(0,0,0,0.15)' }}>
        <SidebarContent />
      </aside>
    </>
  );
}
