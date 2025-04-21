import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 