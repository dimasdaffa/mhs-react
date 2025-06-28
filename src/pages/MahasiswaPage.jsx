// Di dalam file src/pages/MahasiswaPage.jsx

import React, { useState } from "react";
import MahasiswaTable from "../components/organisms/MahasiswaTable";
import AdminButton from "../components/atoms/AdminButton";
import Modal from "../components/molecules/Modal";
import FormGroup from "../components/molecules/FormGroup";
import { useAuth } from "../context/AuthContext";
import { confirmDeleteStudent } from "../helpers/swalHelper";
import { showErrorToast } from "../helpers/toastHelper";
import { formatDataWithId } from "../helpers/idHelper";
import { 
  useMahasiswa, 
  useStoreMahasiswa, 
  useUpdateMahasiswa, 
  useDeleteMahasiswa 
} from "../hooks/useMahasiswa";

const MahasiswaPage = () => {
  // Pagination, search, and sorting states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // React Query hooks with query parameters
  const {
    data: result = { data: [], total: 0 },
    isLoading: loading,
    error
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: perPage,
  });

  const { data: mahasiswa = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / perPage);

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMhs, setCurrentMhs] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for controlled components
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    max_sks: 18
  });

  const { user } = useAuth();

  // Pagination handlers
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const resetForm = () => {
    setFormData({ nim: '', nama: '', max_sks: 18 });
    setIsModalOpen(false);
    setCurrentMhs(null);
    setIsEditMode(false);
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentMhs(null);
    setFormData({ nim: '', nama: '', max_sks: 18 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mhs) => {
    setIsEditMode(true);
    setCurrentMhs(mhs);
    setFormData({ 
      nim: mhs.nim, 
      nama: mhs.nama, 
      max_sks: mhs.max_sks || 18 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (mhs) => {
    const result = await confirmDeleteStudent(mhs.nama);
    if (result.isConfirmed) {
      remove(mhs.id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_sks' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode) {
        update({ id: currentMhs.id, data: formData });
        resetForm();
      } else {
        // Check if NIM already exists (in current page data)
        const exists = mahasiswa.find((m) => m.nim === formData.nim);
        if (exists) {
          showErrorToast("NIM sudah terdaftar!");
          setSubmitting(false);
          return;
        }
        
        // Format data with sequential ID before sending
        const dataWithId = formatDataWithId(formData, mahasiswa);
        store(dataWithId);
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    resetForm();
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
          Gagal mengambil data mahasiswa. Silakan refresh halaman.
        </div>
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

        {/* Search, Sort, and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="flex-grow min-w-64">
            <input
              type="text"
              placeholder="Cari nama/NIM..."
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sort By Field */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="nama">Sort by Nama</option>
            <option value="nim">Sort by NIM</option>
            <option value="max_sks">Sort by Max SKS</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          {/* Items per page */}
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5 per halaman</option>
            <option value="10">10 per halaman</option>
            <option value="20">20 per halaman</option>
            <option value="50">50 per halaman</option>
          </select>
        </div>

        {/* Results info */}
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan {mahasiswa.length} dari {totalCount} total mahasiswa
          {search && ` (pencarian: "${search}")`}
        </div>

        {mahasiswa.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {search ? `Tidak ada mahasiswa yang ditemukan dengan pencarian "${search}".` : "Tidak ada data mahasiswa."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              permissions={user?.permissions || []}
              isLoading={loading}
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Halaman {page} dari {totalPages} ({totalCount} total data)
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                onClick={handlePrev}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium">
                {page}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
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
          <FormGroup
            label="Maksimal SKS"
            type="number"
            name="max_sks"
            id="max_sks"
            required
            placeholder="Masukkan maksimal SKS"
            value={formData.max_sks}
            onChange={handleInputChange}
            min="12"
            max="24"
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
