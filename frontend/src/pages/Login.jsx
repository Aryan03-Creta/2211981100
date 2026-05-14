import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiMail, FiLock, FiArrowRight, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setUser({ token: res.data.token, role: res.data.role });
      
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <FiBriefcase className="text-2xl" />
            </div>
            <span className="text-3xl font-extrabold tracking-tighter text-white">CareerGrid<span className="text-indigo-500">.</span></span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to access your account</p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950 border border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-600"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950 border border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder-slate-600"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            <button type="submit" className="btn-premium w-full">
              Sign In <FiArrowRight />
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            New here? <Link to="/register" className="text-indigo-400 font-bold hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
