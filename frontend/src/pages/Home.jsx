import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiBriefcase,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiUsers,
  FiAward,
  FiTarget,
} from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/jobs?search=${searchQuery}`);
    }
  };

  const stats = [
    { label: "Active Jobs",    value: "12k+", icon: <FiBriefcase /> },
    { label: "Companies",      value: "850+", icon: <FiGlobe />     },
    { label: "Professionals",  value: "45k+", icon: <FiUsers />     },
    { label: "Verified",       value: "100%", icon: <FiAward />     },
  ];

  const categories = [
    { label: "Engineering", count: "2.4k", icon: <FiBriefcase /> },
    { label: "Marketing",   count: "1.1k", icon: <FiTarget />    },
    { label: "Design",      count: "850",  icon: <FiSearch />    },
    { label: "Management",  count: "420",  icon: <FiBriefcase /> },
  ];

  const features = [
    { title: "Quality Listings", desc: "Every job on our platform is manually verified to ensure high standards." },
    { title: "Smart Filters",    desc: "Find exactly what you are looking for with our advanced search parameters." },
    { title: "Quick Apply",      desc: "Upload your resume once and apply to multiple jobs with a single click." },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-300">

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-indigo-500/10 border border-indigo-500/20
                       text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            The #1 Premium Job Portal
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8 text-slate-900 dark:text-white"
          >
            Connect with your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              Dream Career Today
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            CareerGrid helps thousands of professionals find their next high-impact role
            at leading global organisations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto p-2 rounded-3xl
                       bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl
                       border border-slate-200 dark:border-white/10 shadow-2xl
                       flex flex-col md:flex-row gap-2 mb-20"
          >
            <div className="flex-1 flex items-center px-6 gap-3">
              <FiSearch className="text-slate-500 text-xl shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                className="w-full bg-transparent border-none outline-none
                           text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 h-14 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2
                         px-8 py-4 bg-indigo-600 hover:bg-indigo-500
                         text-white font-bold rounded-2xl transition-all
                         active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Start Searching <FiArrowRight />
            </button>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto
                          border-t border-white/5 pt-16">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/10
                                flex items-center justify-center text-indigo-600 dark:text-indigo-500 mb-4">
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{s.value}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Categories ── */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Categories</h2>
              <p className="text-slate-500">Explore the most demanded sectors in the market.</p>
            </div>
            <Link
              to="/jobs"
              className="text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm"
            >
              View all jobs <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 cursor-pointer
                           transition-all hover:border-indigo-500/30 shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5
                                flex items-center justify-center mb-6 text-slate-500 dark:text-slate-400 text-2xl">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{cat.label}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {cat.count} Positions
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CareerGrid ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto overflow-hidden rounded-[3rem] bg-indigo-600
                        flex flex-col lg:flex-row">
          {/* Left text */}
          <div className="p-12 lg:p-20 flex-1 flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-12 leading-tight">
              Why Thousands of Professionals <br /> Choose CareerGrid
            </h2>
            <div className="space-y-8">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <FiCheckCircle className="text-2xl text-indigo-300 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-indigo-100/70 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right testimonial */}
          <div className="lg:w-5/12 p-8 lg:p-12 bg-indigo-700/40 flex items-center justify-center">
            <div className="bg-indigo-500/30 p-10 rounded-[2rem] border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-400/30 flex items-center justify-center mb-8">
                <FiCheckCircle className="text-3xl text-white" />
              </div>
              <p className="text-xl font-medium text-white italic mb-8 leading-relaxed">
                "CareerGrid is the most reliable platform I've used. I found my current role within
                2 weeks of using it."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-300/30" />
                <div>
                  <div className="font-bold text-white text-xs uppercase tracking-widest">
                    Sarah Jenkins
                  </div>
                  <div className="text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">
                    Senior Product Designer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
