import React, { useState, useEffect } from 'react';
import MahasiswaTable from '../components/organisms/MahasiswaTable';
import AdminButton from '../components/atoms/AdminButton';
import Modal from '../components/molecules/Modal';
import FormGroup from '../components/molecules/FormGroup';
import { getAllMahasiswa, storeMahasiswa, deleteMahasiswa, updateMahasiswa } from '../api/MahasiswaApi'; // <-- 1. Impor fungsi API

const MahasiswaPage = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMhs, setCurrentMhs] = useState(null);

  // <-- 2. Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllMahasiswa();
      setMahasiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data mahasiswa:", error);
    } finally {
      setLoading(false);
    }
  };

  // <-- 3. Gunakan useEffect untuk memanggil API saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentMhs(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mhs) => {
    setIsEditMode(true);
    setCurrentMhs(mhs);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (mhs) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${mhs.nama}?`)) {
      try {
        await deleteMahasiswa(mhs.id);
        fetchData(); // Ambil data lagi setelah berhasil hapus
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        if(isEditMode) {
            await updateMahasiswa(currentMhs.id, data);
        } else {
            await storeMahasiswa(data);
        }
        fetchData(); // Refresh data
        setIsModalOpen(false); // Tutup modal
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mahasiswa</h2>
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold">Daftar Mahasiswa</h3>
          <AdminButton onClick={handleOpenAddModal} variant="primary">
            + Tambah Mahasiswa
          </AdminButton>
        </div>
        
        <MahasiswaTable 
          mahasiswa={mahasiswa}
          onEdit={handleOpenEditModal} // <-- Kirim fungsi edit
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
      >
        <form onSubmit={handleSubmit}>
            <FormGroup
            label="NIM"
            type="text"
            name="nim"
            id="nim"
            required
            placeholder="Masukkan NIM"
            defaultValue={currentMhs?.nim || ''}
            />
            <FormGroup
            label="Nama"
            type="text"
            name="nama"
            id="nama"
            required
            placeholder="Masukkan Nama"
            defaultValue={currentMhs?.nama || ''}
            />
            <div className="flex justify-end space-x-2 mt-4">
                <AdminButton type="button" onClick={() => setIsModalOpen(false)} variant="secondary">Batal</AdminButton>
                <AdminButton type="submit" variant="primary">Simpan</AdminButton>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default MahasiswaPage;