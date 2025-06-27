// Di dalam file src/pages/MahasiswaPage.jsx

import React, { useState, useEffect } from "react";
import MahasiswaTable from "../components/organisms/MahasiswaTable";
import AdminButton from "../components/atoms/AdminButton";
import Modal from "../components/molecules/Modal";
import FormGroup from "../components/molecules/FormGroup";
import {
  getAllMahasiswa,
  storeMahasiswa,
  deleteMahasiswa,
  updateMahasiswa,
} from "../api/MahasiswaApi";
import { useAuth } from "../context/AuthContext";
import { confirmDeleteStudent } from "../helpers/swalHelper";
import { showSuccessToast, showErrorToast } from "../helpers/toastHelper";
import { formatDataWithId } from "../helpers/idHelper";

const MahasiswaPage = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMhs, setCurrentMhs] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for controlled components
  const [formData, setFormData] = useState({
    nim: '',
    nama: ''
  });

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMahasiswa();
      setMahasiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data mahasiswa:", error);
      setError("Gagal mengambil data mahasiswa. Silakan coba lagi.");
      showErrorToast("Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentMhs(null);
    setFormData({ nim: '', nama: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mhs) => {
    setIsEditMode(true);
    setCurrentMhs(mhs);
    setFormData({ nim: mhs.nim, nama: mhs.nama });
    setIsModalOpen(true);
  };

  const handleDelete = async (mhs) => {
    const result = await confirmDeleteStudent(mhs.nama);
    if (result.isConfirmed) {
      try {
        await deleteMahasiswa(mhs.id);
        showSuccessToast("Data mahasiswa berhasil dihapus!");
        fetchData();
      } catch (error) {
        showErrorToast("Gagal menghapus data mahasiswa.");
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode) {
        await updateMahasiswa(currentMhs.id, formData);
        showSuccessToast("Data mahasiswa berhasil diperbarui!");
      } else {
        // Format data with sequential ID before sending
        const dataWithId = formatDataWithId(formData, mahasiswa);
        await storeMahasiswa(dataWithId);
        showSuccessToast("Data mahasiswa berhasil ditambahkan!");
      }
      fetchData();
      setIsModalOpen(false);
      setFormData({ nim: '', nama: '' });
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      showErrorToast(isEditMode ? "Gagal memperbarui data mahasiswa" : "Gagal menambahkan data mahasiswa");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMhs(null);
    setIsEditMode(false);
    setFormData({ nim: '', nama: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Mahasiswa</h2>
      
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Daftar Mahasiswa</h3>
          {user && user.permissions?.includes("mahasiswa.create") && (
            <AdminButton onClick={handleOpenAddModal} variant="primary">
              + Tambah Mahasiswa
            </AdminButton>
          )}
        </div>

        {mahasiswa.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data mahasiswa.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              permissions={user?.permissions || []}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup
            label="NIM"
            type="text"
            name="nim"
            id="nim"
            required
            placeholder="Masukkan NIM"
            value={formData.nim}
            onChange={handleInputChange}
          />
          <FormGroup
            label="Nama"
            type="text"
            name="nama"
            id="nama"
            required
            placeholder="Masukkan Nama"
            value={formData.nama}
            onChange={handleInputChange}
          />
          <div className="flex justify-end space-x-2 mt-6">
            <AdminButton
              type="button"
              onClick={handleCloseModal}
              variant="secondary"
              disabled={submitting}
            >
              Batal
            </AdminButton>
            <AdminButton 
              type="submit" 
              variant="primary"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MahasiswaPage;
