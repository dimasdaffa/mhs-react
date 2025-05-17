import React, { useState } from 'react';
import MahasiswaTable from '../components/organisms/MahasiswaTable';
import AdminButton from '../components/atoms/AdminButton';
import Modal from '../components/molecules/Modal';
import FormGroup from '../components/molecules/FormGroup';
import { confirmDeleteStudent, confirmSaveChanges } from '../helpers/swalHelper';
import { showSuccessToast, showErrorToast } from '../helpers/toastHelper';
// 
const MahasiswaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState(null);
  const [mahasiswa, setMahasiswa] = useState([
    { nim: 'A11.2022.14079', nama: 'Supardo' },
    { nim: 'A11.2022.14080', nama: 'Supardi' },
    { nim: 'A11.2022.14081', nama: 'Sapardi' },
  ]);

  const handleEdit = (mhs) => {
    setEditingMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const handleDelete = async (mhs) => {
    const result = await confirmDeleteStudent(mhs.nama);
    if (result.isConfirmed) {
      setMahasiswa(mahasiswa.filter(m => m.nim !== mhs.nim));
      showSuccessToast('Data mahasiswa berhasil dihapus!');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nim = formData.get('nim');
    const nama = formData.get('nama');

    // Validasi input
    if (!nim || !nama) {
      showErrorToast('NIM dan Nama harus diisi!');
      return;
    }

    // Validasi NIM format
    if (!nim.match(/^[A-Z]\d{2}\.\d{4}\.\d{5}$/)) {
      showErrorToast('Format NIM tidak valid! Contoh: A11.2022.14079');
      return;
    }

    // Cek NIM duplikat (kecuali jika sedang edit)
    if (!editingMahasiswa && mahasiswa.some(m => m.nim === nim)) {
      showErrorToast('NIM sudah terdaftar!');
      return;
    }

    const result = await confirmSaveChanges();
    if (result.isConfirmed) {
      const newMahasiswa = {
        nim: nim,
        nama: nama,
      };
      
      if (editingMahasiswa) {
        // Update data yang sudah ada
        setMahasiswa(mahasiswa.map(m => 
          m.nim === editingMahasiswa.nim ? newMahasiswa : m
        ));
        showSuccessToast('Data mahasiswa berhasil diperbarui!');
      } else {
        // Tambah data baru
        setMahasiswa([...mahasiswa, newMahasiswa]);
        showSuccessToast('Data mahasiswa berhasil ditambahkan!');
      }
      
      setIsModalOpen(false);
      setEditingMahasiswa(null);
      event.target.reset();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMahasiswa(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mahasiswa</h2>
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold">Daftar Mahasiswa</h3>
          <AdminButton 
            onClick={() => {
              setEditingMahasiswa(null);
              setIsModalOpen(true);
            }}
            variant="primary"
          >
            + Tambah Mahasiswa
          </AdminButton>
        </div>
        
        <MahasiswaTable 
          mahasiswa={mahasiswa}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        onSubmit={handleSubmit}
      >
        <FormGroup
          label="NIM"
          type="text"
          name="nim"
          id="nim"
          required
          placeholder="Masukkan NIM (contoh: A11.2022.14079)"
          defaultValue={editingMahasiswa?.nim}
        />
        <FormGroup
          label="Nama"
          type="text"
          name="nama"
          id="nama"
          required
          placeholder="Masukkan Nama"
          defaultValue={editingMahasiswa?.nama}
        />
      </Modal>
    </div>
  );
};

export default MahasiswaPage; 