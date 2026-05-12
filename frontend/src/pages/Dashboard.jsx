import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  FiBriefcase, 
  FiCheckCircle, 
  FiUsers, 
  FiTrendingUp, 
  FiArrowRight, 
  FiSearch, 
  FiGlobe,
  FiUser,
  FiLayers
} from "react-icons/fi";
import { motion } from "framer-motion";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    jobsPosted: 0,
    activeJobs: 0,
    totalApplicants: 0,
    applications: [],
    jobs: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker";
        const res = await api.get(endpoint);
        const notesRes = await api.get("/notifications");
        setNotifications(notesRes.data.slice(0, 5));
        
        if (role === "employer") {
          setStats({
            jobsPosted: res.data.jobsPosted || 0,
            activeJobs: res.data.jobs?.filter(j => j.isActive !== false).length || 0,
            totalApplicants: res.data.stats?.reduce((acc, s) => acc + (s.totalApplicants || 0), 0) || 0,
            applications: [],
            jobs: res.data.jobs || []
          });
        } else {
          setStats({
            jobsPosted: res.data.totalApplications || 0,
            activeJobs: res.data.applications?.filter(a => a.status === "accepted").length || 0,
            totalApplicants: res.data.applications?.filter(a => a.status === "pending").length || 0,
            applications: res.data.applications || [],
            jobs: []
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-6 lg:ml-64 transition-all">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Tracking your career performance and activities.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: role === "employer" ? "Jobs Posted" : "Applied Jobs", val: stats.jobsPosted, icon: <FiBriefcase />, color: "bg-indigo-600 shadow-indigo-500/20" },
                { label: role === "employer" ? "Active Jobs" : "Shortlisted", val: stats.activeJobs, icon: <FiCheckCircle />, color: "bg-emerald-600 shadow-emerald-500/20" },
                { label: role === "employer" ? "Total Applicants" : "Interviews", val: stats.totalApplicants, icon: <FiUsers />, color: "bg-orange-600 shadow-orange-500/20" }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="careergrid-card !p-6"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {card.icon}
                  </div>
                  <div className="text-4xl font-black mb-1">{card.val}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{card.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Activity */}
            <div className="careergrid-card overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Applications Activity</h2>
                  <FiTrendingUp className="text-indigo-500 text-xl" />
               </div>
               <div className="min-h-[300px]">
                  <AnalyticsCharts data={stats} role={role} />
               </div>
            </div>

            {/* Recent Updates Section */}
            <div className="careergrid-card">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Recent Updates</h2>
                  <Link to="/notifications" className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:underline">View All</Link>
               </div>
               <div className="space-y-6">
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">No recent updates yet.</p>
                  ) : (
                    notifications.map((note, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${note.read ? "bg-slate-600" : "bg-indigo-500 animate-pulse"}`}></div>
                          <span className={`text-sm font-medium transition-colors ${note.read ? "text-slate-500" : "text-slate-200 group-hover:text-indigo-400"}`}>
                            {note.message}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar Area (1/3 width) */}
          <div className="space-y-8">
            <div className="careergrid-card !bg-white/80 dark:!bg-slate-900/50">
               <h3 className="text-xl font-bold mb-6">Pro Tips</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-8">
                 Profiles with a complete work history are <span className="text-emerald-500 font-bold text-base">3x more likely</span> to get noticed by recruiters.
               </p>
               <button className="btn-premium w-full py-3 text-xs uppercase tracking-[0.2em]" onClick={() => navigate("/profile")}>
                 Complete Profile
               </button>
            </div>

            <div className="careergrid-card">
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-4">
                  {[
                    ...(role === "jobseeker" ? [{ name: "My Applications", path: "/my-applications", icon: <FiLayers /> }] : []),
                    { name: "Browse Jobs", path: "/jobs", icon: <FiSearch /> },
                    { name: "My Profile", path: "/profile", icon: <FiUser /> },
                    { name: "Public Board", path: "/jobs", icon: <FiGlobe /> }
                  ].map((link, i) => (
                    <Link key={i} to={link.path} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                       <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">{link.icon}</span>
                       <span className="text-sm font-bold text-slate-300">{link.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
