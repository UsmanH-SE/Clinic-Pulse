import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      {/* lg:ml-60 matches the sidebar width */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-60">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
