import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiDownload, FiCheck, FiX, FiInfo, FiFileText, FiActivity, FiCpu, FiShield } from "react-icons/fi";

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      fetchApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:ml-64 transition-all">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
           <h1 className="text-3xl font-bold dark:text-white">Job Applicants</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage candidates who applied for this position.</p>
        </header>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
             <FiUser className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
             <p className="text-slate-500 font-bold text-sm">No applications found for this job listing.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  {/* Applicant Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0">
                      <img
                        src={app.applicant?.profile?.avatar ? `http://localhost:5000/${app.applicant.profile.avatar}` : `https://ui-avatars.com/api/?name=${app.applicant?.name}&background=6366f1&color=fff`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{app.applicant?.name}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-[150px]">{app.applicant?.email}</p>
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <DetailItem icon={<FiPhone className="text-indigo-500" />} text={app.phone || "No Phone"} />
                    <DetailItem icon={<FiBriefcase className="text-indigo-500" />} text={app.experience || "No Exp"} />
                    <DetailItem icon={<FiDollarSign className="text-indigo-500" />} text={app.expectedSalary || "No Salary"} />
                    <DetailItem icon={<FiCpu className="text-indigo-500" />} text={app.noticePeriod || "No Notice"} />
                  </div>

                  {/* Skills */}
                  {app.skills && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {app.skills.split(",").slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Resume Action */}
                  {app.resume && (
                    <a
                      href={`http://localhost:5000/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mb-6"
                    >
                      <FiDownload />
                      View Resume
                    </a>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <StatusBadge status={app.status} />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app._id, "accepted")}
                        className="w-9 h-9 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Accept Application"
                      >
                        <FiCheck className="text-lg" />
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="w-9 h-9 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Reject Application"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
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

function DetailItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">{text}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500 border-amber-200 dark:border-amber-500/20",
    accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500 border-rose-200 dark:border-rose-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}