import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-20 transition-all">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}

