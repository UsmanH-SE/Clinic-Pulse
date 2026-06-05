import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6">
      {/* Left — Title */}
      <div>
        <h1 className="text-[17px] font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        {/* Date / Time chip */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
          {dateStr} · {timeStr}
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-slate-800 leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
