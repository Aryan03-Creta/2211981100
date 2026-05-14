import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiBriefcase, FiMapPin, FiDollarSign, FiTag, FiUpload, FiArrowRight, FiShield, FiCpu, FiGlobe, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    qualifications: "",
    responsibilities: "",
    location: "",
    salary: "",
    category: "",
    type: "Full-time",
  });

  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (logo) {
        formData.append("logo", logo);
      }
      await api.post("/jobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Job Posted Successfully!");
      setError("");
      setTimeout(() => navigate("/employer/jobs"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.details 
        ? `${err.response.data.error}: ${err.response.data.details}`
        : (err.response?.data?.error || "Failed to post job. Please try again.");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-28 pb-20 px-6 lg:pl-72 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* 🚀 Header Node */}
        <header className="mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-600/10 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-violet-500/20">
              <FiCpu className="animate-spin-slow" /> Job Creation
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter dark:text-white mb-4">
              Post a <span className="text-gradient">New Job</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium italic">Find the perfect candidate by publishing your open role to our premium talent network.</p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[1.5rem] bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-4 mb-10"
          >
            <FiShield className="text-xl" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-4 mb-10"
          >
            <FiCheckCircle className="text-xl" />
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
           
           {/* Section 1: Entity Identification */}
           <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[50px]"></div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <span className="w-4 h-[1px] bg-violet-500"></span> 01. Company Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Company Name</label>
                   <div className="relative group">
                      <FiGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" />
                      <input
                        name="companyName" placeholder="e.g. TechCorp Inc." value={form.companyName} onChange={handleChange} required
                        className="w-full pl-14 pr-4 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border-white/5 focus:ring-2 focus:ring-violet-500 transition-all font-bold text-sm"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Job Title</label>
                   <div className="relative group">
                      <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" />
                      <input
                        name="title" placeholder="e.g. Senior Frontend Engineer" value={form.title} onChange={handleChange} required
                        className="w-full pl-14 pr-4 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border-white/5 focus:ring-2 focus:ring-violet-500 transition-all font-bold text-sm"
                      />
                   </div>
                </div>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-violet-500/30 transition-colors">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                   {logo ? <img src={URL.createObjectURL(logo)} className="w-full h-full object-contain" /> : <FiUpload className="text-2xl text-slate-400" />}
                </div>
                <div className="flex-1">
                   <h3 className="font-extrabold text-sm dark:text-white uppercase tracking-tight">Company Logo</h3>
                   <p className="text-[10px] text-slate-500 mt-1 font-medium">SVG, PNG or WEBP (Max 5MB). A clear logo helps candidates recognize your brand.</p>
                </div>
                <label className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl">
                   Upload Logo
                   <input type="file" hidden onChange={(e) => setLogo(e.target.files[0])} />
                </label>
              </div>
           </div>

           {/* Section 2: Job Outline */}
           <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card rounded-[2.5rem] p-8">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-emerald-500"></span> 02. Compensation
                 </h2>
                 <div className="relative group">
                    <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                    <input
                      name="salary" placeholder="e.g. $80k - $120k / 20-30 LPA" value={form.salary} onChange={handleChange} required
                      className="w-full pl-14 pr-4 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
                    />
                 </div>
              </div>
              <div className="glass-card rounded-[2.5rem] p-8">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-sky-500"></span> 03. Location
                 </h2>
                 <div className="relative group">
                    <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500" />
                    <input
                      name="location" placeholder="e.g. Remote / New York / Bangalore" value={form.location} onChange={handleChange} required
                      className="w-full pl-14 pr-4 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm"
                    />
                 </div>
              </div>
           </div>

           {/* Section 3: Role Specifics */}
           <div className="glass-card rounded-[2.5rem] p-8 lg:p-12">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <span className="w-4 h-[1px] bg-indigo-500"></span> 04. Role Details
              </h2>
              <div className="space-y-6">
                 <textarea
                   name="description" placeholder="Describe the job role and its primary objective..." value={form.description} onChange={handleChange} required rows="5"
                   className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-sm leading-relaxed"
                 />
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Requirements</label>
                       <textarea
                         name="qualifications" placeholder="List required skills and experience..." value={form.qualifications} onChange={handleChange} required rows="3"
                         className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm leading-relaxed"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Responsibilities</label>
                       <textarea
                         name="responsibilities" placeholder="List day-to-day responsibilities..." value={form.responsibilities} onChange={handleChange} required rows="3"
                         className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-sm leading-relaxed"
                       />
                    </div>
                 </div>
              </div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="w-full py-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-4"
           >
             {loading ? <span className="animate-pulse">Publishing Job...</span> : (
               <>Publish Job <FiArrowRight className="text-xl" /></>
             )}
           </button>
        </form>
      </motion.div>
    </div>
  );
}