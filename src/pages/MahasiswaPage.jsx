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
import { useAuth } from "../context/AuthContext"; // <-- Import useAuth
import { confirmDeleteStudent } from "../helpers/swalHelper";
import { showSuccessToast, showErrorToast } from "../helpers/toastHelper";

const MahasiswaPage = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMhs, setCurrentMhs] = useState(null);

  const { user } = useAuth(); // <-- Dapatkan user dari context

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
    const result = await confirmDeleteStudent(mhs.nama);
    if (result.isConfirmed) {
      try {
        await deleteMahasiswa(mhs.id);
        showSuccessToast("Data berhasil dihapus!");
        fetchData();
      } catch (error) {
        showErrorToast("Gagal menghapus data.");
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isEditMode) {
        await updateMahasiswa(currentMhs.id, data);
      } else {
        await storeMahasiswa(data);
      }
      fetchData(); // Refresh data
      setIsModalOpen(false); // Tutup modal
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mahasiswa</h2>
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold">Daftar Mahasiswa</h3>
          {/* Tampilkan tombol hanya jika punya izin 'mahasiswa.create' */}
          {user && user.permissions.includes("mahasiswa.create") && (
            <AdminButton onClick={handleOpenAddModal} variant="primary">
              + Tambah Mahasiswa
            </AdminButton>
          )}
        </div>

        <MahasiswaTable
          mahasiswa={mahasiswa}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          permissions={user?.permissions || []} // <-- Kirim permissions ke table
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
            defaultValue={currentMhs?.nim || ""}
          />
          <FormGroup
            label="Nama"
            type="text"
            name="nama"
            id="nama"
            required
            placeholder="Masukkan Nama"
            defaultValue={currentMhs?.nama || ""}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <AdminButton
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
            >
              Batal
            </AdminButton>
            <AdminButton type="submit" variant="primary">
              Simpan
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MahasiswaPage;
