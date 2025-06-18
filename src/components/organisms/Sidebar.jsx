import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { confirmLogout } from '../../helpers/swalHelper';
import { showSuccessToast } from '../../helpers/toastHelper';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (result.isConfirmed) {
      logout();
      showSuccessToast('Logout berhasil!');
      navigate('/login');
    }
  };

  // Early return if user is not loaded yet
  if (!user) {
    return null;
  }

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-blue-300">Login sebagai: {user.role}</p>
      </div>
      <nav className="flex-1">
        {user.permissions?.includes('dashboard.read') && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded mt-2 ${
                isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
              }`
            }
          >
            <span className="ml-2">🏠 Dashboard</span>
          </NavLink>
        )}
        {user.permissions?.includes('mahasiswa.read') && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center p-3 rounded mt-2 ${
                isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
              }`
            }
          >
            <span className="ml-2">🎓 Mahasiswa</span>
          </NavLink>
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