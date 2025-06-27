import React, { useState, useEffect, useCallback } from 'react';
import { getAllMahasiswa } from '../api/MahasiswaApi';
import { getAllDosen } from '../api/DosenApi';
import { getAllMataKuliah } from '../api/MataKuliahApi';
import { getAllKelas, updateKelas } from '../api/KelasApi';
import { showErrorToast, showSuccessToast } from '../helpers/toastHelper';

// Import komponen yang akan kita gunakan
import TableRencanaStudi from '../components/organisms/TableRencanaStudi';
import AdminButton from '../components/atoms/AdminButton';

const RencanaStudiPage = () => {
  // 1. State Management
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState({});

  // 2. Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resMahasiswa, resDosen, resMataKuliah, resKelas] = await Promise.all([
        getAllMahasiswa(),
        getAllDosen(),
        getAllMataKuliah(),
        getAllKelas(),
      ]);
      
      console.log('Data loaded:', {
        mahasiswa: resMahasiswa.data,
        dosen: resDosen.data,
        mataKuliah: resMataKuliah.data,
        kelas: resKelas.data
      });
      
      setMahasiswa(resMahasiswa.data);
      setDosen(resDosen.data);
      setMataKuliah(resMataKuliah.data);
      setKelas(resKelas.data);
    } catch (error) {
      showErrorToast('Gagal memuat data Rencana Studi.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Helper Functions (Logika Bisnis) - Fixed with proper ID comparison
  const getDosen = (id) => {
    return dosen.find(item => String(item.id) === String(id));
  };
  
  const getMataKuliah = (id) => {
    return mataKuliah.find(item => String(item.id) === String(id));
  };
  
  const getMahasiswa = (id) => {
    return mahasiswa.find(item => String(item.id) === String(id));
  };

  const getMahasiswaMaxSks = (id) => {
    const mhs = getMahasiswa(id);
    return mhs?.max_sks || 0;
  };

  const getTotalSksMahasiswa = (mahasiswaId) => {
    return kelas.reduce((acc, k) => {
      if (k.mahasiswa_ids && k.mahasiswa_ids.some(id => String(id) === String(mahasiswaId))) {
        const mk = getMataKuliah(k.matakuliah_id);
        return acc + (mk ? mk.sks : 0);
      }
      return acc;
    }, 0);
  };
  
  // 4. Fungsi Aksi (Handlers)
  const handleAddMahasiswa = async (kelasItem) => {
    const mahasiswaId = selectedMahasiswa[kelasItem.id];
    if (!mahasiswaId) {
      showErrorToast('Pilih mahasiswa terlebih dahulu.');
      return;
    }

    // Initialize mahasiswa_ids if it doesn't exist
    const currentMahasiswaIds = kelasItem.mahasiswa_ids || [];

    if (currentMahasiswaIds.some(id => String(id) === String(mahasiswaId))) {
      showErrorToast('Mahasiswa sudah terdaftar di kelas ini.');
      return;
    }
    
    const mhsMaxSks = getMahasiswaMaxSks(mahasiswaId);
    const mhsCurrentSks = getTotalSksMahasiswa(mahasiswaId);
    const sksKelasIni = getMataKuliah(kelasItem.matakuliah_id)?.sks || 0;

    if (mhsCurrentSks + sksKelasIni > mhsMaxSks) {
      showErrorToast(`Gagal: Total SKS akan menjadi ${mhsCurrentSks + sksKelasIni}, melebihi batas SKS mahasiswa (${mhsMaxSks}).`);
      return;
    }

    try {
      const updatedKelas = {
        ...kelasItem,
        mahasiswa_ids: [...currentMahasiswaIds, String(mahasiswaId)],
      };
      await updateKelas(kelasItem.id, updatedKelas);
      showSuccessToast('Mahasiswa berhasil ditambahkan.');
      fetchData();
      setSelectedMahasiswa(prev => ({ ...prev, [kelasItem.id]: '' })); // Reset dropdown
    } catch (error) {
      showErrorToast('Gagal mengupdate data kelas.');
      console.error('Error updating kelas:', error);
    }
  };

  const handleDeleteMahasiswa = async (kelasItem, mahasiswaId) => {
     try {
        const currentMahasiswaIds = kelasItem.mahasiswa_ids || [];
        const updatedMahasiswaIds = currentMahasiswaIds.filter(id => String(id) !== String(mahasiswaId));
        const updatedKelas = { ...kelasItem, mahasiswa_ids: updatedMahasiswaIds };
        await updateKelas(kelasItem.id, updatedKelas);
        showSuccessToast('Mahasiswa berhasil dihapus dari kelas.');
        fetchData();
     } catch (error) {
        showErrorToast('Gagal menghapus mahasiswa.');
        console.error('Error deleting mahasiswa:', error);
     }
  };

  const handleSelectChange = (kelasId, mhsId) => {
    setSelectedMahasiswa(prev => ({ ...prev, [kelasId]: mhsId }));
  };

  if (loading) return <div className="text-center p-8">Memuat data...</div>;

  if (!mahasiswa.length || !dosen.length || !mataKuliah.length) {
    return (
      <div className="text-center p-8">
        <p>Data tidak lengkap. Pastikan data mahasiswa, dosen, dan mata kuliah sudah tersedia.</p>
        <button 
          onClick={fetchData}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // 5. Render Komponen
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manajemen Rencana Studi</h2>
      </div>
      
      {kelas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada kelas yang tersedia.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {kelas.map((k) => {
            const mk = getMataKuliah(k.matakuliah_id);
            const dosenData = getDosen(k.dosen_id);
            const currentMahasiswaIds = k.mahasiswa_ids || [];
            
            return (
              <div key={k.id} className="bg-white p-6 shadow-md rounded-lg">
                <div className="border-b pb-3 mb-4">
                  <h3 className="text-xl font-bold text-blue-800">
                    {mk?.name || 'Mata Kuliah Tidak Ditemukan'} ({mk?.sks || 0} SKS)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dosen Pengampu: {dosenData?.name || 'Dosen Tidak Ditemukan'}
                  </p>
                </div>

                <h4 className="font-semibold mb-2">Daftar Mahasiswa</h4>
                {currentMahasiswaIds.length > 0 ? (
                  <TableRencanaStudi
                    kelasItem={k}
                    mahasiswa={mahasiswa}
                    getTotalSksMahasiswa={getTotalSksMahasiswa}
                    onDeleteMahasiswa={handleDeleteMahasiswa}
                  />
                ) : (
                  <p className="text-gray-500 italic">Belum ada mahasiswa di kelas ini.</p>
                )}

                {/* Form Tambah Mahasiswa */}
                <div className="mt-4 pt-4 border-t flex items-center gap-2">
                  <select
                    value={selectedMahasiswa[k.id] || ''}
                    onChange={(e) => handleSelectChange(k.id, e.target.value)}
                    className="flex-grow w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="" disabled>Pilih untuk menambahkan mahasiswa...</option>
                    {mahasiswa.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nim} - {m.nama}
                      </option>
                    ))}
                  </select>
                  <AdminButton variant="primary" onClick={() => handleAddMahasiswa(k)}>
                    + Tambah
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RencanaStudiPage;