import React from 'react';
import NavLink from '../atoms/NavLink';

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <nav>
        <NavLink icon="🏠" isActive={false}>Dashboard</NavLink>
        <NavLink icon="🎓" isActive={true}>Mahasiswa</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 