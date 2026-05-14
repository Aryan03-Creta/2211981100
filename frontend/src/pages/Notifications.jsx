import { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiInfo, FiClock, FiTrash2, FiActivity, FiShield, FiCpu } from "react-icons/fi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((note) =>
          note._id === id ? { ...note, read: true } : note
        )
      );
    } catch (err) {
       console.error("Mark read error:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => api.put(`/notifications/${n._id}/read`)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      await api.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const getIcon = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("accepted")) return <FiCheck className="text-xl" />;
    if (msg.includes("rejected")) return <FiX className="text-xl" />;
    if (msg.includes("posted")) return <FiCpu className="text-xl" />;
    if (msg.includes("applied")) return <FiActivity className="text-xl" />;
    return <FiBell className="text-xl" />;
  };

  const getIconBg = (message, read) => {
    if (read) return "bg-slate-100 dark:bg-slate-800 text-slate-400";
    const msg = message.toLowerCase();
    if (msg.includes("accepted")) return "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20";
    if (msg.includes("rejected")) return "bg-rose-600 text-white shadow-lg shadow-rose-500/20";
    if (msg.includes("posted")) return "bg-violet-600 text-white shadow-lg shadow-violet-500/20";
    return "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:ml-64 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold dark:text-white mb-2 uppercase tracking-tighter">Notifications</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Keep track of your latest job applications and platform updates.</p>
          </div>
          <div className="flex items-center gap-4">
            {notifications.length > 0 && (
              <>
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-[10px] font-black uppercase tracking-widest">
                  {notifications.filter(n => !n.read).length} Unread
                </div>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markAllRead}
                    className="px-4 py-2 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100 dark:border-emerald-800/20"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-rose-600/10 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 dark:border-rose-800/20"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </header>

        {notifications.length === 0 ? (
          <div className="card p-16 text-center careergrid-card">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <FiBell className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold dark:text-white mb-2">All caught up!</h2>
            <p className="text-slate-500 dark:text-slate-400">You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`card p-6 flex gap-6 items-start relative overflow-hidden group transition-all duration-500 ${
                    note.read ? "opacity-60 grayscale-[0.5] border-transparent" : "bg-white dark:bg-slate-900 border-l-4 border-l-indigo-500 shadow-xl shadow-indigo-500/5 dark:shadow-none"
                  }`}
                >
                   {!note.read && (
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
                   )}

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 ${getIconBg(note.message, note.read)}`}>
                    {getIcon(note.message)}
                  </div>
 
                  <div className="flex-1">
                    <p className={`text-sm md:text-base font-bold mb-2 leading-relaxed ${note.read ? "text-slate-500" : "text-slate-900 dark:text-white"}`}>
                      {note.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      <FiClock className="text-xs" />
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!note.read && (
                      <button
                        onClick={() => markRead(note._id)}
                        className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 dark:border-emerald-800/30 flex-shrink-0"
                        title="Mark as read"
                      >
                        <FiCheck className="text-xl" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(note._id)}
                      className="w-10 h-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800/30 flex-shrink-0"
                      title="Delete notification"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}


