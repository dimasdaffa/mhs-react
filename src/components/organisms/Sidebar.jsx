import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { confirmLogout } from "../../helpers/swalHelper";
import { showSuccessToast } from "../../helpers/toastHelper";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (result.isConfirmed) {
      logout();
      showSuccessToast("Logout berhasil!");
      navigate("/login");
    }
  };

  // Early return if user is not loaded yet
  if (!user) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠", permission: "dashboard.read" },
    { name: "Mahasiswa", href: "/admin/mahasiswa", icon: "🎓", permission: "mahasiswa.read" },
    { name: "Laporan SKS", href: "/admin/mahasiswa-sks", icon: "📈", permission: "mahasiswa-sks.read" },
    { name: "Dosen", href: "/admin/dosen", icon: "👨‍🏫", permission: "dosen.read" },
    { name: "Mata Kuliah", href: "/admin/mata-kuliah", icon: "📖", permission: "mata-kuliah.read" },
    { name: "Kelas", href: "/admin/kelas", icon: "🏫", permission: "kelas.read" },
    { name: "Rencana Studi", href: "/admin/rencana-studi", icon: "📚", permission: "rencana-studi.page" },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-blue-300">Login sebagai: {user.role}</p>
      </div>
      <nav className="flex-1">
        {navigation.map((item) =>
          user.permissions?.includes(item.permission) ? (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center p-3 rounded mt-2 ${
                  isActive ? "bg-blue-700" : "bg-blue-800 hover:bg-blue-700"
                }`
              }
            >
              <span className="ml-2">{item.icon} {item.name}</span>
            </NavLink>
          ) : null
        )}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center p-3 rounded mt-2 bg-red-600 hover:bg-red-700 w-full"
      >
        <span className="ml-2">🚪 Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
