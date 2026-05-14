import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiLoader,
  FiArrowRight,
  FiZap
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FiCheckCircle />;
      case "rejected":
        return <FiXCircle />;
      default:
        return <FiLoader className="animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-28 pb-20 px-6 lg:pl-72 transition-colors duration-500 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
            <FiBriefcase /> TRACKING HUB
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 uppercase leading-none">
            My <span className="text-gradient">Applications</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic uppercase text-xs tracking-widest">
            Monitor your career trajectory and response status.
          </p>
        </header>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white dark:bg-white/5 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-white/5" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 careergrid-card">
            <FiZap className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
            <h2 className="text-2xl font-black mb-4 uppercase">No Applications Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto font-bold italic">
              You haven't applied to any nodes yet. Start your journey by exploring available roles.
            </p>
            <Link to="/jobs" className="btn-premium inline-flex items-center gap-2">
              Browse Jobs <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence>
              {applications.map((app, i) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="careergrid-card group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10 transition-all group-hover:bg-indigo-600/10"></div>
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center p-3 shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                        {app.job?.companyLogo ? (
                          <img src={`http://localhost:5000/${app.job.companyLogo}`} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <FiBriefcase className="text-slate-400 text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight group-hover:text-indigo-500 transition-colors uppercase leading-tight mb-1">
                          {app.job?.title || "Unknown Position"}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 dark:text-indigo-400 tracking-wider">
                          {app.job?.companyName || "Unknown Company"}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <FiMapPin className="text-indigo-500" /> {app.job?.location || "Remote"}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <FiClock className="text-indigo-500" /> {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-300 transition-colors">
                      Applied via CareerGrid Nexus
                    </div>
                    <Link to="/jobs" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                      <FiArrowRight className="text-xl" />
                    </Link>
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
