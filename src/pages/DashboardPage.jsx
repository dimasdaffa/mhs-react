import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-bold mb-4">Selamat Datang di Dashboard Admin</h3>
        <p className="text-gray-600">
          Silakan pilih menu di sidebar untuk mengakses fitur yang tersedia.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage; 