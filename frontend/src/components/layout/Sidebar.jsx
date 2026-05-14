import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiSearch,
  FiUser,
  FiBell,
  FiLogOut,
  FiBriefcase,
  FiLayers,
  FiPlusCircle,
  FiSun,
  FiMoon,
  FiShield
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const role = user?.role;
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (err) {
      console.error("Logout reset failed:", err);
    }
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    ...(role !== "admin" ? [
      { name: "Dashboard", icon: <FiGrid />, path: "/dashboard", section: "NAVIGATION" }
    ] : []),
    ...(role === "jobseeker" ? [
      { name: "Search Jobs", icon: <FiSearch />, path: "/jobs", section: "NAVIGATION" },
      { name: "My Applications", icon: <FiLayers />, path: "/my-applications", section: "NAVIGATION" }
    ] : []),
    ...(role === "employer" ? [
      { name: "Post a Job", icon: <FiPlusCircle />, path: "/jobs/new", section: "NAVIGATION" },
      { name: "My Postings", icon: <FiLayers />, path: "/employer/jobs", section: "NAVIGATION" }
    ] : []),
    ...(role === "admin" ? [
      { name: "Verification Center", icon: <FiShield />, path: "/admin", section: "SYSTEM" }
    ] : [
      { name: "My Profile", icon: <FiUser />, path: "/profile", section: "ACCOUNT" },
      { name: "Notifications", icon: <FiBell />, path: "/notifications", section: "ACCOUNT" }
    ]),
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-white/5 pt-28 pb-10 px-4 hidden lg:flex flex-col z-40 transition-colors duration-300">
      {/* Brand Logo inside Sidebar */}
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <FiBriefcase className="text-xl" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">CareerGrid</span>
      </div>

      <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
        {["NAVIGATION", "ACCOUNT", "SYSTEM"].map((section) => {
          const links = navLinks.filter((link) => link.section === section);
          if (links.length === 0) return null;

          return (
            <div key={section}>
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                {section}
              </h3>
              <div className="space-y-1">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${isActive
                        ? "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                        />
                      )}
                      <span className={`text-xl ${isActive ? "text-indigo-500" : "group-hover:text-indigo-500 dark:group-hover:text-white"}`}>
                        {link.icon}
                      </span>
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-2">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
        >
          {theme === "dark" ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          <span className="text-sm font-bold uppercase tracking-widest">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-2xl transition-all group"
        >
          <FiLogOut className="text-xl" />
          <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );
}
