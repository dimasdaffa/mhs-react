import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { confirmLogout } from '../../helpers/swalHelper';
import { showSuccessToast } from '../../helpers/toastHelper';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (result.isConfirmed) {
      localStorage.removeItem('isLoggedIn');
      showSuccessToast('Logout berhasil!');
      navigate('/login');
    }
  };

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <nav className="flex-1">
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