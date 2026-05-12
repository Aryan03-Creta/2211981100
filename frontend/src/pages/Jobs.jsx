import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FiSearch, FiMapPin, FiDollarSign, FiZap, FiArrowRight, FiBriefcase, FiCalendar, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    category: "",
    sort: "newest",
  });

  const limit = 6;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/search", {
        params: { ...filters, page, limit },
      });
      setJobs(res.data.results);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:ml-64 transition-all">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold dark:text-white mb-2">Discovery Hub</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover your next career move among {total} verified job listings.</p>
        </header>

        {/* Search Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-12 shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="md:col-span-4 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="md:col-span-3">
              <button className="btn-primary w-full py-3 text-sm">
                Search Jobs
              </button>
            </div>
          </form>
        </section>

        {/* Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} onClick={() => navigate(`/apply/${job._id}`)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                  page === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 flex flex-col cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2">
           {job.companyLogo ? (
             <img src={`http://localhost:5000/${job.companyLogo}`} className="w-full h-full object-contain" />
           ) : (
             <FiBriefcase className="text-xl text-slate-400" />
           )}
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md uppercase tracking-wider">
          New
        </span>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-2">
          {job.title}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
          {job.companyName}
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
           <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <FiDollarSign className="text-indigo-500" /> {job.salary}
           </div>
           <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <FiMapPin className="text-indigo-500" /> {job.location}
           </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
           <FiClock /> {new Date(job.createdAt).toLocaleDateString()}
         </span>
         <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
           View Details <FiArrowRight />
         </span>
      </div>
    </motion.div>
  );
}