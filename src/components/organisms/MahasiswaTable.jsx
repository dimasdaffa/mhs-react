import React from 'react';
import TableHeader from '../atoms/TableHeader';
import TableCell from '../atoms/TableCell';
import AdminButton from '../atoms/AdminButton';

const MahasiswaTable = ({ mahasiswa, onEdit, onDelete }) => {
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
          <tr key={mhs.nim} className="border">
            <TableCell>{mhs.nim}</TableCell>
            <TableCell>{mhs.nama}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <AdminButton
                  variant="warning"
                  onClick={() => onEdit(mhs)}
                  className="px-2 py-1"
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={() => onDelete(mhs)}
                  className="px-2 py-1"
                >
                  Hapus
                </AdminButton>
              </div>
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable; 