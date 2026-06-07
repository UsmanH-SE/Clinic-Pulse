import { useAuth } from '../../context/AuthContext';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-6">

      {/* Left — Title (push right on mobile for hamburger button) */}
      <div className="pl-10 lg:pl-0">
        <h1 className="text-[16px] font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Date chip — hidden on small screens */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse flex-shrink-0" />
          {dateStr}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-[10px] font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-slate-800 leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
