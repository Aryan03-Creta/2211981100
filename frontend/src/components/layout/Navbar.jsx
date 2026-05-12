import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FiLogOut, FiBell, FiGrid, FiPlus, FiBriefcase, FiSun, FiMoon } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [scroll, setScroll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const res = await api.get("/notifications");
          const count = res.data.filter(n => !n.read).length;
          setUnreadCount(count);
        } catch (err) {
          console.error("Failed to fetch notification count");
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scroll
        ? "bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20"
        : "bg-[#020617]/60 backdrop-blur-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FiBriefcase className="text-white text-lg" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Career<span className="text-indigo-600 dark:text-indigo-400">Grid</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "employer" && (
                <Link
                  to="/jobs/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500
                             text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  <FiPlus /> Post Job
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/dashboard"
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all"
              >
                <FiGrid />
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="p-2 mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}