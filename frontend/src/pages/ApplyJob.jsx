import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiUpload, FiFileText, FiCheckCircle, FiCpu, FiGlobe, FiActivity, FiShield } from "react-icons/fi";

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    experience: "",
    currentCompany: "",
    expectedSalary: "",
    noticePeriod: "",
    skills: "",
    coverLetter: ""
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (resume) {
        formData.append("resume", resume);
      }

      await api.post(`/applications/apply/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess("Application sent successfully! Good luck.");
      setTimeout(() => navigate("/jobs"), 2500);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to send application. Please try again.");
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
        {/* Header */}
        <header className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-600/10 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-500/20">
              <FiActivity className="animate-pulse" /> Job Application
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 dark:text-white uppercase leading-none">
             Apply for <span className="text-gradient">this Position</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-bold italic">Tell the employer why you're the best fit for this role.</p>
        </header>

        <section className="glass-card rounded-[3rem] p-10 lg:p-14 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] -z-10"></div>
           
           {error && (
             <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-4 mb-10">
                <FiShield className="text-xl" /> {error}
             </motion.div>
           )}

           {success && (
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-4 mb-10">
                <FiCheckCircle className="text-xl" /> {success}
             </motion.div>
           )}

           <form onSubmit={handleSubmit} className="space-y-12">
             {/* Part 1: Personal Information */}
             <div className="space-y-8">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-4 h-[1px] bg-violet-500"></span> 01. Personal Information
               </h2>
               <div className="grid md:grid-cols-2 gap-8">
                 <VaultInput icon={<FiUser />} name="name" placeholder="Your Full Name" value={form.name} onChange={handleChange} required />
                 <VaultInput icon={<FiMail />} type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                 <VaultInput icon={<FiPhone />} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
                 <div className="grid grid-cols-2 gap-4">
                   <VaultInput icon={<FiMapPin />} name="city" placeholder="City" value={form.city} onChange={handleChange} />
                   <VaultInput icon={<FiGlobe />} name="country" placeholder="Country" value={form.country} onChange={handleChange} />
                 </div>
               </div>
             </div>

             {/* Part 2: Work Experience */}
             <div className="space-y-8">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-4 h-[1px] bg-emerald-500"></span> 02. Work Experience
               </h2>
               <div className="grid md:grid-cols-2 gap-8">
                 <VaultInput icon={<FiBriefcase />} name="experience" placeholder="Years of Experience (e.g. 2 Years)" value={form.experience} onChange={handleChange} />
                 <VaultInput icon={<FiActivity />} name="currentCompany" placeholder="Current Company (or None)" value={form.currentCompany} onChange={handleChange} />
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                 <VaultInput icon={<FiDollarSign />} name="expectedSalary" placeholder="Expected Salary (LPA)" value={form.expectedSalary} onChange={handleChange} />
                 <VaultInput icon={<FiClock />} name="noticePeriod" placeholder="Notice Period (e.g. 30 Days)" value={form.noticePeriod} onChange={handleChange} />
               </div>
               <VaultInput icon={<FiCpu />} name="skills" placeholder="Your Key Skills (e.g. React, Node, SQL)" value={form.skills} onChange={handleChange} />
             </div>

             {/* Part 3: Additional Documents */}
             <div className="space-y-8">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-4 h-[1px] bg-sky-500"></span> 03. Additional Info
               </h2>
               <textarea
                 name="coverLetter" placeholder="Cover Letter: Tell us more about yourself and why you're interested..." value={form.coverLetter} onChange={handleChange} rows="5"
                 className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-[#020617] border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-sm leading-relaxed dark:text-white"
               />
               
               <div className="p-10 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] flex flex-col items-center gap-6 text-center group hover:border-violet-500/30 transition-colors duration-500">
                  <div className="w-16 h-16 bg-white dark:bg-[#020617] rounded-2xl flex items-center justify-center text-violet-500 shadow-xl border border-slate-100 dark:border-white/5 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                     <FiFileText className="w-7 h-7" />
                  </div>
                  {resume ? (
                     <div className="text-sm font-black text-violet-600 dark:text-violet-400 truncate max-w-xs">{resume.name}</div>
                  ) : (
                     <div>
                       <h3 className="font-extrabold text-sm dark:text-white mb-2 uppercase tracking-tight">Upload Your Resume</h3>
                       <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-widest">PDF or DOCX format only</p>
                     </div>
                  )}
                  <label className="px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl">
                     {resume ? "Update Resume" : "Select Resume"}
                     <input type="file" hidden onChange={(e) => setResume(e.target.files[0])} required={!resume} />
                  </label>
               </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:opacity-90 shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 border-2 border-transparent hover:border-violet-500/30"
             >
               {loading ? <span className="animate-pulse">Submitting...</span> : (
                 <>Submit Application <FiCheckCircle className="text-xl" /></>
               )}
             </button>
           </form>
        </section>
      </motion.div>
    </div>
  );
}

function VaultInput({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors z-10">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border-white/5 focus:ring-2 focus:ring-violet-500 transition-all font-bold text-sm dark:text-white placeholder:text-slate-500 placeholder:italic"
      />
    </div>
  );
}