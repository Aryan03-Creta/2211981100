import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";


const PUBLIC_ROUTES = ["/", "/login", "/register"];

function AppLayout() {
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  
  const showSidebar = !!user && !PUBLIC_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white transition-all duration-300">
      <Navbar />
      {showSidebar && <Sidebar />}
      <AppRoutes />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
