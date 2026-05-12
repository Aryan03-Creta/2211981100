import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiEdit, FiSave, FiUpload, FiX, FiCheckCircle, FiUser, FiBriefcase, FiMapPin, FiGlobe, FiCpu, FiShield, FiActivity, FiArrowRight, FiFileText, FiPhone, FiLinkedin } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [editing, setEditing] = useState(false);
  const role = localStorage.getItem("role");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
      setCompletion(res.data.profileCompletion);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setUser({ ...user, name: e.target.value });
    } else {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  const saveProfile = async () => {
    try {
      const profileData = { ...user.profile };
      if (typeof profileData.skills === "string") {
        profileData.skills = profileData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      }
      await api.put("/profile", { ...profileData, name: user.name });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const uploadAvatar = async (e) => {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    await api.post("/profile/avatar", formData);
    fetchProfile();
  };

  const uploadResume = async (e) => {
    const formData = new FormData();
    formData.append("resume", e.target.files[0]);
    await api.post("/profile/resume", formData);
    fetchProfile();
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:ml-64 transition-all">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <section className="card p-8 md:p-12 mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-lg">
                  <img
                    src={user.profile?.avatar ? `http://localhost:5000/${user.profile.avatar}` : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-lg cursor-pointer text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                  <FiEdit className="w-4 h-4" />
                  <input type="file" hidden onChange={uploadAvatar} />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                 <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    {editing ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={user.name} 
                        onChange={handleChange} 
                        className="text-3xl font-bold dark:text-white bg-transparent border-b border-indigo-500 focus:outline-none w-full md:w-48 lg:w-64"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold dark:text-white">{user.name}</h1>
                    )}
                    {user.verification?.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                         <FiShield /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-500/20">
                         <FiShield /> Pending Verification
                      </span>
                    )}
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                    {user.email}
                 </p>

                 <div className="max-w-xs mx-auto md:mx-0">
                    <div className="flex justify-between items-center mb-1.5 capitalize overflow-hidden">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Completion</span>
                       <span className="text-xs font-bold text-indigo-600">{completion}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${completion}%` }}
                         className="h-full bg-indigo-600"
                       />
                    </div>
                 </div>
              </div>

              <button
                onClick={() => (editing ? saveProfile() : setEditing(true))}
                className={`btn-primary !px-8 py-3 text-sm min-w-[160px] ${
                  editing 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {editing ? "Save Changes" : "Edit Profile"}
              </button>
           </div>
        </section>

        {/* Profile Details */}
        <section className="space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ProfileField label="About You" name="bio" value={user.profile?.bio} editing={editing} onChange={handleChange} icon={<FiUser />} isTextArea />
              </div>
              
              {role === "jobseeker" ? (
                <>
                  <ProfileField label="Skills" name="skills" value={Array.isArray(user.profile?.skills) ? user.profile.skills.join(", ") : user.profile?.skills} editing={editing} onChange={handleChange} icon={<FiCpu />} />
                  <ProfileField label="Experience (Years)" name="experience" value={user.profile?.experience} editing={editing} onChange={handleChange} icon={<FiBriefcase />} />
                  
                  <ProfileField label="Location" name="location" value={user.profile?.location} editing={editing} onChange={handleChange} icon={<FiMapPin />} />
                  <ProfileField label="Phone Number" name="phone" value={user.profile?.phone} editing={editing} onChange={handleChange} icon={<FiPhone />} />
                  <ProfileField label="Portfolio Website" name="portfolio" value={user.profile?.portfolio} editing={editing} onChange={handleChange} icon={<FiGlobe />} />
                  <ProfileField label="LinkedIn Profile" name="linkedin" value={user.profile?.linkedin} editing={editing} onChange={handleChange} icon={<FiLinkedin />} />
                  
                  <div className="md:col-span-2">
                    <ProfileField label="Additional Projects / Experience" name="projects" value={user.profile?.projects} editing={editing} onChange={handleChange} icon={<FiActivity />} isTextArea />
                  </div>

                  <div className="md:col-span-2 card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                     <h3 className="text-sm font-bold uppercase tracking-wider mb-6 dark:text-white flex items-center gap-2">
                        <FiFileText className="text-indigo-600" /> Resume / CV
                     </h3>
                     <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                              <FiFileText className="text-xl" />
                           </div>
                           <div>
                              {user.profile?.resume ? (
                                <>
                                  <p className="text-sm font-bold dark:text-white">{user.profile.resume.split("/").pop()}</p>
                                  <a href={`http://localhost:5000/${user.profile.resume}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-semibold hover:underline">Download Resume</a>
                                </>
                              ) : (
                                <p className="text-sm text-slate-500">No resume uploaded yet.</p>
                              )}
                           </div>
                        </div>
                        <label className="btn-secondary !px-6 py-2.5 text-xs cursor-pointer">
                           {user.profile?.resume ? "Update Resume" : "Upload Resume"}
                           <input type="file" hidden onChange={uploadResume} />
                        </label>
                     </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Personal Details</h3>
                  </div>
                  <ProfileField label="Full Name" name="employerName" value={user.profile?.employerName} editing={editing} onChange={handleChange} icon={<FiUser />} />
                  <ProfileField label="Designation / Role" name="employerRole" value={user.profile?.employerRole} editing={editing} onChange={handleChange} icon={<FiBriefcase />} />
                  <ProfileField label="Phone Number" name="phone" value={user.profile?.phone} editing={editing} onChange={handleChange} icon={<FiPhone />} />
                  <ProfileField label="LinkedIn (Personal)" name="linkedin" value={user.profile?.linkedin} editing={editing} onChange={handleChange} icon={<FiLinkedin />} />

                  <div className="md:col-span-2 border-b border-slate-100 dark:border-slate-800 pb-2 mt-4 mb-2">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Company Details</h3>
                  </div>
                  <ProfileField label="Company Name" name="companyName" value={user.profile?.companyName} editing={editing} onChange={handleChange} icon={<FiBriefcase />} />
                  <ProfileField label="Company Location" name="location" value={user.profile?.location} editing={editing} onChange={handleChange} icon={<FiMapPin />} />
                  <ProfileField label="Company Website" name="website" value={user.profile?.website} editing={editing} onChange={handleChange} icon={<FiGlobe />} />
                  <div className="md:col-span-2">
                    <ProfileField label="Company Description" name="companyDescription" value={user.profile?.companyDescription} editing={editing} onChange={handleChange} icon={<FiActivity />} isTextArea />
                  </div>
                  
                  <div className="md:col-span-2 border-b border-slate-100 dark:border-slate-800 pb-2 mt-4 mb-2">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Company Culture & Hiring</h3>
                  </div>
                  <div className="md:col-span-2">
                    <ProfileField label="Why Join Us / Hiring Process" name="projects" value={user.profile?.projects} editing={editing} onChange={handleChange} icon={<FiActivity />} isTextArea />
                  </div>
                </>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}

function ProfileField({ label, name, value, editing, onChange, icon, isTextArea }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
        {editing ? (
          isTextArea ? (
            <textarea
              name={name} value={value || ""} onChange={onChange} rows="4"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
          ) : (
            <input
              type="text" name={name} value={value || ""} onChange={onChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
          )
        ) : (
          <div className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent text-sm font-medium dark:text-slate-300">
            {value || <span className="text-slate-500 italic">Not set</span>}
          </div>
        )}
      </div>
    </div>
  );
}