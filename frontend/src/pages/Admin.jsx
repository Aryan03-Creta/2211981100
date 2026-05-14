import { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiCheck, FiX, FiInfo, FiMail, FiCalendar, FiActivity, FiCpu, FiLock, FiBriefcase, FiUser } from "react-icons/fi";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/pending");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchPending(), fetchNotifications()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.post(`/admin/verify/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await api.post(`/admin/reject/${id}`, { reason });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Rejection failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-28 pb-20 px-6 lg:pl-72 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* 🛂 Admin Header */}
        <header className="mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-600/10 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-rose-500/20">
              <FiLock className="animate-pulse" /> Authority Control Node
           </div>
           <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white mb-2">Nexus <span className="text-gradient">Security Firewall</span></h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium italic">Validate employer credentials and authorize high-level access to the recruitment infrastructure.</p>
        </header>

        {users.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-[3rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[50px] -z-10"></div>
             <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl">
                <FiCheck className="w-8 h-8 text-emerald-500" />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-bold italic uppercase tracking-widest text-xs tracking-[0.3em]">Integrity Maintained: No pending authorization requests.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-[50px] -z-10 group-hover:bg-violet-600/10 transition-colors"></div>
                  
                  {/* Employer Identity */}
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-2xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
                      <FiBriefcase className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{user.name}</h2>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest italic">{user.email}</p>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full w-fit bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Check */}
                  <div className="space-y-4 mb-10 flex-1">
                     <div className="flex items-center gap-3 text-slate-500">
                        <FiCalendar className="text-violet-500 text-xs" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Registered Node: {new Date(user.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-500 flex items-start gap-4">
                        <FiInfo className="text-lg shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold leading-relaxed tracking-tight uppercase italic">Access Denied: Verification required to enable platform capabilities.</p>
                     </div>
                  </div>

                  {/* Authority Actions */}
                  <div className="mt-auto flex gap-4">
                    <button
                      onClick={() => handleReject(user._id)}
                      className="flex-1 py-5 bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <FiX /> Terminate
                    </button>
                    <button
                      onClick={() => handleVerify(user._id)}
                      className="flex-[2] py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl hover:bg-emerald-500 hover:text-white flex items-center justify-center gap-3"
                    >
                      <FiCheck className="text-lg" /> Authorize
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 📢 Recent Activity Section */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-600 border border-violet-500/20">
              <FiActivity className="text-xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white uppercase tracking-tighter">System <span className="text-violet-500">Activity Log</span></h2>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-3xl text-slate-500 italic text-sm">
                No recent activity recorded.
              </div>
            ) : (
              notifications.slice(0, 10).map((note) => (
                <div key={note._id} className="glass-card p-5 rounded-2xl flex items-center gap-4 border border-white/5 group hover:border-violet-500/20 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    note.type === "registration" ? "bg-emerald-600 shadow-lg shadow-emerald-500/20" : "bg-indigo-600 shadow-lg shadow-indigo-500/20"
                  }`}>
                    {note.type === "registration" ? <FiUser /> : <FiActivity />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{note.message}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

