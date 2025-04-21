import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminButton from '../components/atoms/AdminButton';

const MahasiswaDetailPage = () => {
  const { nim } = useParams();
  const navigate = useNavigate();

  // Data dummy untuk contoh
  const mahasiswa = {
    nim: nim,
    nama: 'Supardo',
    jurusan: 'Teknik Informatika',
    angkatan: '2022',
    alamat: 'Semarang',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Detail Mahasiswa</h2>
        <AdminButton
          variant="secondary"
          onClick={() => navigate('/admin/mahasiswa')}
        >
          Kembali
        </AdminButton>
      </div>
      
      <div className="bg-white p-4 shadow rounded">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">NIM</label>
            <p className="mt-1">{mahasiswa.nim}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <p className="mt-1">{mahasiswa.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jurusan</label>
            <p className="mt-1">{mahasiswa.jurusan}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Angkatan</label>
            <p className="mt-1">{mahasiswa.angkatan}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat</label>
            <p className="mt-1">{mahasiswa.alamat}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaDetailPage; 