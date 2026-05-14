import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiShield, FiArrowRight } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setSuccess(
        form.role === "employer"
          ? "Success! Wait for admin verification."
          : "Success! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Full Error Object:", err);
      console.log("Config URL:", err.config?.url);
      console.log("Error Code:", err.code);
      
      const msg = err.response?.data?.error || err.response?.data?.message || (err.code === "ERR_NETWORK" ? "Network Error: Please check if the backend is running on port 5000." : err.message) || "Registration failed. Please check your connection or try another email.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-indigo-600 dark:text-indigo-500 tracking-tighter inline-block mb-4">
            CareerGrid<span className="text-emerald-500">.</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join thousands of professionals today</p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
        >
          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-rose-100 dark:border-rose-500/20">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
              <FiCheckCircle /> {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative md:col-span-2">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" name="name" placeholder="Full Name" required
                value={form.name} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            <div className="relative md:col-span-2">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email" name="email" placeholder="Email Address" required
                value={form.email} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password" name="password" placeholder="Password" required
                value={form.password} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password" name="confirmPassword" placeholder="Confirm" required
                value={form.confirmPassword} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Register As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({...form, role: "jobseeker"})}
                className={`py-4 rounded-2xl font-bold transition-all border-2 ${form.role === "jobseeker" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500"}`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setForm({...form, role: "employer"})}
                className={`py-4 rounded-2xl font-bold transition-all border-2 ${form.role === "employer" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500"}`}
              >
                Employer
              </button>
            </div>
          </div>

          {form.role === "employer" && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex gap-3">
              <FiShield className="text-amber-500 flex-shrink-0 mt-1" />
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Employer accounts require manual verification by our security team before jobs can be posted.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Join CareerGrid"}
            {!loading && <FiArrowRight />}
          </button>

          <p className="text-slate-500 dark:text-slate-400 text-center mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}