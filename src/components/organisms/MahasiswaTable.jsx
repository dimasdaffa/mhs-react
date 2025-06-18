import React from 'react';
import { Link } from 'react-router-dom';
import TableHeader from '../atoms/TableHeader';
import TableCell from '../atoms/TableCell';
import AdminButton from '../atoms/AdminButton';

// Terima props 'permissions'
const MahasiswaTable = ({ mahasiswa, onEdit, onDelete, permissions }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-700 text-white">
          <TableHeader>NIM</TableHeader>
          <TableHeader>Nama</TableHeader>
          <TableHeader>Aksi</TableHeader>
        </tr>
      </thead>
      <tbody>
        {mahasiswa.map((mhs) => (
          <tr key={mhs.id} className="border">
            <TableCell>
              <Link 
                to={`/admin/mahasiswa/${mhs.nim}`}
                className="text-blue-600 hover:underline"
              >
                {mhs.nim}
              </Link>
            </TableCell>
            <TableCell>
              <div className="space-x-2">
                {/* Tampilkan tombol Edit jika punya izin 'mahasiswa.update' */}
                {permissions.includes('mahasiswa.update') && (
                  <AdminButton
                    variant="warning"
                    onClick={() => onEdit(mhs)}
                    className="px-2 py-1"
                  >
                    Edit
                  </AdminButton>
                )}
                {/* Tampilkan tombol Hapus jika punya izin 'mahasiswa.delete' */}
                {permissions.includes('mahasiswa.delete') && (
                  <AdminButton
                    variant="danger"
                    onClick={() => onDelete(mhs)}
                    className="px-2 py-1"
                  >
                    Hapus
                  </AdminButton>
                )}
              </div>
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
