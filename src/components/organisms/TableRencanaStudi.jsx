import React from 'react';
import AdminButton from '../atoms/AdminButton';

const TableRencanaStudi = ({ kelasItem, mahasiswa, getTotalSksMahasiswa, onDeleteMahasiswa }) => {
  const currentMahasiswaIds = kelasItem.mahasiswa_ids || [];
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 font-semibold text-gray-700 border">NIM</th>
            <th className="p-3 font-semibold text-gray-700 border">Nama Mahasiswa</th>
            <th className="p-3 font-semibold text-gray-700 border">Total SKS Diambil</th>
            <th className="p-3 font-semibold text-gray-700 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentMahasiswaIds.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500 italic border">
                Belum ada mahasiswa di kelas ini.
              </td>
            </tr>
          ) : (
            currentMahasiswaIds.map(mhsId => {
              const mhs = mahasiswa.find(m => String(m.id) === String(mhsId));
              if (!mhs) {
                return (
                  <tr key={mhsId}>
                    <td colSpan="4" className="p-3 text-center text-red-500 border">
                      Mahasiswa dengan ID {mhsId} tidak ditemukan
                    </td>
                  </tr>
                );
              }
              
              return (
                <tr key={mhs.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{mhs.nim}</td>
                  <td className="p-3 border">{mhs.nama}</td>
                  <td className="p-3 font-medium border">
                    {getTotalSksMahasiswa(mhs.id)} / {mhs.max_sks} SKS
                  </td>
                  <td className="p-3 border">
                    <AdminButton 
                      variant="danger" 
                      onClick={() => onDeleteMahasiswa(kelasItem, mhs.id)}
                      className="px-3 py-1 text-sm"
                    >
                      Hapus
                    </AdminButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableRencanaStudi;