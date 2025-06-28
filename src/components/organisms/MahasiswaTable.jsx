import React from 'react';
import { Link } from 'react-router-dom';
import TableHeader from '../atoms/TableHeader';
import TableCell from '../atoms/TableCell';
import AdminButton from '../atoms/AdminButton';

const MahasiswaTable = ({ mahasiswa, onEdit, onDelete, permissions }) => {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIM
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mahasiswa.map((mhs, index) => (
            <tr 
              key={mhs.id} 
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  to={`/admin/mahasiswa/${mhs.nim}`}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  {mhs.nim}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {mhs.nama}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {permissions.includes('mahasiswa.update') && (
                    <button
                      onClick={() => onEdit(mhs)}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                  )}
                  {permissions.includes('mahasiswa.delete') && (
                    <button
                      onClick={() => onDelete(mhs)}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
