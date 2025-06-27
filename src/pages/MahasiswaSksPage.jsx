import React, { useState, useEffect } from 'react';
import { getAllMahasiswa } from '../api/MahasiswaApi';
import { getAllKelas } from '../api/KelasApi';
import { getAllMataKuliah } from '../api/MataKuliahApi';

const MahasiswaSksPage = () => {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [mahasiswaRes, kelasRes, mataKuliahRes] = await Promise.all([
        getAllMahasiswa(),
        getAllKelas(),
        getAllMataKuliah()
      ]);
      setMahasiswaList(mahasiswaRes.data);
      setKelasList(kelasRes.data);
      setMataKuliahList(mataKuliahRes.data);
    } catch (err) {
      setError('Gagal mengambil data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSksMahasiswa = (mahasiswaId) => {
    return kelasList.reduce((total, kelas) => {
      if (kelas.mahasiswa_ids && kelas.mahasiswa_ids.some(id => String(id) === String(mahasiswaId))) {
        const mataKuliah = mataKuliahList.find(mk => String(mk.id) === String(kelas.matakuliah_id));
        return total + (mataKuliah?.sks || 0);
      }
      return total;
    }, 0);
  };

  const getKelasYangDiambil = (mahasiswaId) => {
    return kelasList.filter(kelas => 
      kelas.mahasiswa_ids && kelas.mahasiswa_ids.some(id => String(id) === String(mahasiswaId))
    ).map(kelas => {
      const mataKuliah = mataKuliahList.find(mk => String(mk.id) === String(kelas.matakuliah_id));
      return {
        ...kelas,
        mataKuliah
      };
    });
  };

  const getStatusSks = (currentSks, maxSks) => {
    const percentage = (currentSks / maxSks) * 100;
    if (percentage >= 90) return { text: 'Hampir Penuh', color: 'bg-red-100 text-red-800' };
    if (percentage >= 70) return { text: 'Sedang', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Ringan', color: 'bg-green-100 text-green-800' };
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={fetchAllData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Laporan SKS Mahasiswa</h1>
        <p className="text-gray-600">Monitoring total SKS yang sedang ditempuh oleh setiap mahasiswa</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Mahasiswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total SKS Diambil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batas Maksimal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sisa Kapasitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mata Kuliah Diambil
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mahasiswaList.map((mahasiswa, index) => {
                const totalSks = getTotalSksMahasiswa(mahasiswa.id);
                const sisaKapasitas = mahasiswa.max_sks - totalSks;
                const status = getStatusSks(totalSks, mahasiswa.max_sks);
                const kelasYangDiambil = getKelasYangDiambil(mahasiswa.id);

                return (
                  <tr key={mahasiswa.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {mahasiswa.nim}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mahasiswa.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-blue-600">{totalSks} SKS</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mahasiswa.max_sks} SKS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={sisaKapasitas < 3 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {sisaKapasitas} SKS
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {kelasYangDiambil.length > 0 ? (
                        <div className="space-y-1">
                          {kelasYangDiambil.map(kelas => (
                            <div key={kelas.id} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded text-xs">
                              <span>{kelas.mataKuliah?.name || 'Unknown'}</span>
                              <span className="font-semibold text-blue-600">{kelas.mataKuliah?.sks || 0} SKS</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Belum mengambil mata kuliah</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistik Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Mahasiswa</h3>
          <p className="text-3xl font-bold text-blue-600">{mahasiswaList.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Rata-rata SKS</h3>
          <p className="text-3xl font-bold text-green-600">
            {mahasiswaList.length > 0 
              ? (mahasiswaList.reduce((sum, mhs) => sum + getTotalSksMahasiswa(mhs.id), 0) / mahasiswaList.length).toFixed(1)
              : 0
            }
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mahasiswa Aktif</h3>
          <p className="text-3xl font-bold text-purple-600">
            {mahasiswaList.filter(mhs => getTotalSksMahasiswa(mhs.id) > 0).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Beban Penuh</h3>
          <p className="text-3xl font-bold text-orange-600">
            {mahasiswaList.filter(mhs => {
              const totalSks = getTotalSksMahasiswa(mhs.id);
              return (totalSks / mhs.max_sks) >= 0.9;
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaSksPage;