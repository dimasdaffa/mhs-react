import React, { useState, useEffect } from 'react';
import { getAllKelas, storeKelas, updateKelas, deleteKelas } from '../api/KelasApi';
import { getAllMataKuliah } from '../api/MataKuliahApi';
import { getAllDosen } from '../api/DosenApi';
import { formatDataWithId } from '../helpers/idHelper';
import { showSuccessToast, showErrorToast } from '../helpers/toastHelper';
import Modal from '../components/molecules/Modal';
import AdminButton from '../components/atoms/AdminButton';

const KelasPage = () => {
  const [kelasList, setKelasList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    kapasitas_mahasiswa: '',
    matakuliah_id: '',
    dosen_id: '',
    jadwal: {
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: ''
    }
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [kelasRes, mataKuliahRes, dosenRes] = await Promise.all([
        getAllKelas(),
        getAllMataKuliah(),
        getAllDosen()
      ]);
      setKelasList(kelasRes.data);
      setMataKuliahList(mataKuliahRes.data);
      setDosenList(dosenRes.data);
    } catch (err) {
      setError('Gagal mengambil data');
      showErrorToast('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const calculateDosenCurrentSks = (dosenId) => {
    return kelasList.reduce((total, kelas) => {
      if (String(kelas.dosen_id) === String(dosenId)) {
        const mataKuliah = mataKuliahList.find(mk => String(mk.id) === String(kelas.matakuliah_id));
        return total + (mataKuliah?.sks || 0);
      }
      return total;
    }, 0);
  };

  const getAvailableDosen = (selectedMataKuliahId) => {
    if (!selectedMataKuliahId) return dosenList;
    
    const selectedMataKuliah = mataKuliahList.find(mk => String(mk.id) === String(selectedMataKuliahId));
    if (!selectedMataKuliah) return dosenList;

    return dosenList.filter(dosen => {
      const currentSks = calculateDosenCurrentSks(dosen.id);
      const remainingSks = dosen.max_sks - currentSks;
      return remainingSks >= selectedMataKuliah.sks;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('jadwal.')) {
      const jadwalField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        jadwal: {
          ...prev.jadwal,
          [jadwalField]: value
        }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'kapasitas_mahasiswa' ? parseInt(value) || 0 : value 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validasi dosen masih tersedia
    const selectedMataKuliah = mataKuliahList.find(mk => String(mk.id) === String(formData.matakuliah_id));
    const selectedDosen = dosenList.find(d => String(d.id) === String(formData.dosen_id));
    
    if (selectedMataKuliah && selectedDosen) {
      const dosenCurrentSks = calculateDosenCurrentSks(formData.dosen_id);
      const dosenRemainingSks = selectedDosen.max_sks - dosenCurrentSks;
      
      if (dosenRemainingSks < selectedMataKuliah.sks) {
        showErrorToast(`Dosen ${selectedDosen.name} tidak memiliki kapasitas SKS yang cukup. Sisa kapasitas: ${dosenRemainingSks} SKS, Dibutuhkan: ${selectedMataKuliah.sks} SKS`);
        setLoading(false);
        return;
      }
    }

    try {
      const kelasData = {
        ...formData,
        mahasiswa_ids: [],
        status: 'aktif'
      };

      if (editingId) {
        await updateKelas(editingId, kelasData);
        showSuccessToast('Kelas berhasil diperbarui!');
      } else {
        const dataWithId = formatDataWithId(kelasData, kelasList);
        await storeKelas(dataWithId);
        showSuccessToast('Kelas berhasil dibuat!');
      }
      
      resetForm();
      fetchAllData();
    } catch (err) {
      showErrorToast(editingId ? 'Gagal mengupdate kelas' : 'Gagal membuat kelas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kelas) => {
    setEditingId(kelas.id);
    setFormData({
      name: kelas.name,
      kapasitas_mahasiswa: kelas.kapasitas_mahasiswa,
      matakuliah_id: kelas.matakuliah_id,
      dosen_id: kelas.dosen_id,
      jadwal: kelas.jadwal || {
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        ruangan: ''
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      try {
        await deleteKelas(id);
        showSuccessToast('Kelas berhasil dihapus!');
        fetchAllData();
      } catch (err) {
        showErrorToast('Gagal menghapus kelas');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      kapasitas_mahasiswa: '',
      matakuliah_id: '',
      dosen_id: '',
      jadwal: {
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        ruangan: ''
      }
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const getMataKuliahName = (id) => {
    const mk = mataKuliahList.find(item => String(item.id) === String(id));
    return mk ? `${mk.name} (${mk.sks} SKS)` : 'Tidak ditemukan';
  };

  const getDosenName = (id) => {
    const dosen = dosenList.find(item => String(item.id) === String(id));
    return dosen ? dosen.name : 'Tidak ditemukan';
  };

  if (loading && kelasList.length === 0) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
        <AdminButton 
          onClick={() => setIsModalOpen(true)} 
          variant="primary"
        >
          + Buat Kelas Baru
        </AdminButton>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen Pengampu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Mahasiswa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kelasList.map((kelas, index) => (
                <tr key={kelas.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {kelas.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getMataKuliahName(kelas.matakuliah_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getDosenName(kelas.dosen_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kelas.kapasitas_mahasiswa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (kelas.mahasiswa_ids?.length || 0) >= kelas.kapasitas_mahasiswa 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {kelas.mahasiswa_ids?.length || 0} / {kelas.kapasitas_mahasiswa}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {kelas.jadwal ? 
                      `${kelas.jadwal.hari}, ${kelas.jadwal.jam_mulai}-${kelas.jadwal.jam_selesai}` 
                      : 'Belum dijadwal'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(kelas)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kelas.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk Create/Edit Kelas */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingId ? "Edit Kelas" : "Buat Kelas Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kelas</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Kelas A - Algoritma"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Kuliah</label>
            <select
              name="matakuliah_id"
              value={formData.matakuliah_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Mata Kuliah</option>
              {mataKuliahList.map(mk => (
                <option key={mk.id} value={mk.id}>
                  {mk.name} ({mk.sks} SKS) - Semester {mk.semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dosen Pengampu</label>
            <select
              name="dosen_id"
              value={formData.dosen_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Dosen</option>
              {getAvailableDosen(formData.matakuliah_id).map(dosen => {
                const currentSks = calculateDosenCurrentSks(dosen.id);
                return (
                  <option key={dosen.id} value={dosen.id}>
                    {dosen.name} (Sisa kapasitas: {dosen.max_sks - currentSks} SKS)
                  </option>
                );
              })}
            </select>
            {formData.matakuliah_id && getAvailableDosen(formData.matakuliah_id).length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                Tidak ada dosen dengan kapasitas SKS yang cukup untuk mata kuliah ini.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas Mahasiswa</label>
            <input
              type="number"
              name="kapasitas_mahasiswa"
              value={formData.kapasitas_mahasiswa}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Maksimal mahasiswa per kelas"
              min="1"
              max="50"
              required
            />
          </div>

          {/* Jadwal */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Jadwal Kelas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hari</label>
                <select
                  name="jadwal.hari"
                  value={formData.jadwal.hari}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ruangan</label>
                <input
                  type="text"
                  name="jadwal.ruangan"
                  value={formData.jadwal.ruangan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Lab A, Ruang 201"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam Mulai</label>
                <input
                  type="time"
                  name="jadwal.jam_mulai"
                  value={formData.jadwal.jam_mulai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai</label>
                <input
                  type="time"
                  name="jadwal.jam_selesai"
                  value={formData.jadwal.jam_selesai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <AdminButton
              type="button"
              onClick={resetForm}
              variant="secondary"
              disabled={loading}
            >
              Batal
            </AdminButton>
            <AdminButton 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : (editingId ? "Update Kelas" : "Buat Kelas")}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KelasPage;