import React, { useState, useEffect } from 'react';
import MahasiswaModal from '../components/molecules/MahasiswaModal';
import mahasiswaData from '../data/mahasiswa.json';

const MahasiswaPage = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  useEffect(() => {
    setMahasiswa(mahasiswaData.mahasiswa);
  }, []);

  const handleOpenModal = (mahasiswa = null) => {
    setSelectedMahasiswa(mahasiswa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newMahasiswa = {
      id: selectedMahasiswa?.id || Date.now(),
      nim: formData.get('nim'),
      nama: formData.get('nama'),
      status: formData.get('status') === 'true',
    };

    if (selectedMahasiswa) {
      setMahasiswa(mahasiswa.map(m => 
        m.id === selectedMahasiswa.id ? newMahasiswa : m
      ));
    } else {
      setMahasiswa([...mahasiswa, newMahasiswa]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setMahasiswa(mahasiswa.filter(m => m.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Mahasiswa</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tambah Mahasiswa
        </button>
      </div>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">NIM</th>
              <th className="py-3 px-6 text-left">Nama</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {mahasiswa.map((m) => (
              <tr key={m.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{m.nim}</td>
                <td className="py-3 px-6 text-left">{m.nama}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    m.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {m.status ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleOpenModal(m)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MahasiswaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mahasiswaData={selectedMahasiswa}
      />
    </div>
  );
};

export default MahasiswaPage; 