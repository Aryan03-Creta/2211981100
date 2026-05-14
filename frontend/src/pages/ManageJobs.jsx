import { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiTrash2, FiUsers, FiMapPin, FiBriefcase, FiDollarSign, FiPlus, FiX, FiCheck, FiCpu, FiShield, FiActivity } from "react-icons/fi";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/dashboard/employer");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateJob = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${editingJob._id}`, editingJob);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-28 pb-20 px-6 lg:pl-72 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* 🛂 Manage Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-600/10 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-violet-500/20">
                 <FiCpu className="animate-spin-slow" /> Active Job Postings
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white mb-2">Manage <span className="text-gradient">Active Jobs</span></h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">Review and manage all your active job listings and applicants.</p>
           </div>
           <a 
             href="/create-job" 
             className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all"
           >
             <FiPlus /> Post New Job
           </a>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-[3rem]">
             <FiShield className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-6" />
             <p className="text-slate-500 font-bold italic uppercase tracking-widest text-xs">No active job postings found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-[40px] -z-10 group-hover:bg-violet-600/10 transition-colors"></div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl">
                      {job.companyLogo ? (
                        <img src={`http://localhost:5000/${job.companyLogo}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FiBriefcase className="text-violet-500 w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{job.title}</h2>
                      <p className="text-violet-500 font-black text-[9px] uppercase tracking-widest mt-1 italic">{job.category || "General"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <FiMapPin className="text-violet-500" />
                      <span className="text-xs font-bold">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <FiActivity className="text-emerald-500" />
                      <span className="text-xs font-black text-emerald-500">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:border-violet-500/50"
                      >
                        <FiEdit3 className="text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest md:hidden lg:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <FiTrash2 className="text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest md:hidden lg:inline">Delete</span>
                      </button>
                    </div>
                    <a
                      href={`/applicants/${job._id}`}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <FiUsers /> Review Applicants
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Edit Modal (Edit Job Modal) */}
        <AnimatePresence>
          {editingJob && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setEditingJob(null)}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
              />
              <motion.form
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                onSubmit={updateJob}
                className="relative glass-card p-12 rounded-[3.5rem] w-full max-w-2xl border border-white/10 shadow-3xl"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic underline decoration-violet-500">Edit Job Details</h2>
                  <button type="button" onClick={() => setEditingJob(null)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center hover:rotate-90 transition-all border border-white/5">
                    <FiX />
                  </button>
                </div>

                <div className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Title</label>
                      <input
                        type="text" value={editingJob.title}
                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                        className="w-full pl-8 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-white/5 focus:ring-2 focus:ring-violet-500 text-sm font-bold dark:text-white"
                      />
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Location</label>
                        <input
                          type="text" value={editingJob.location}
                          onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                          className="w-full pl-8 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-white/5 focus:ring-2 focus:ring-violet-500 text-sm font-bold dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Compensation</label>
                        <input
                          type="text" value={editingJob.salary}
                          onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                          className="w-full pl-8 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-white/5 focus:ring-2 focus:ring-violet-500 text-sm font-bold dark:text-white"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Description</label>
                      <textarea
                        value={editingJob.description}
                        onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                        rows="4"
                        className="w-full pl-8 pr-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-[#020617] border border-white/5 focus:ring-2 focus:ring-violet-500 text-sm font-medium leading-relaxed dark:text-white resize-none"
                      />
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                  >
                    <FiCheck /> Save Changes
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}