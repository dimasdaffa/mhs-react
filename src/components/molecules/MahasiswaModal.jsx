import React, { useState, useEffect } from 'react';

const MahasiswaModal = ({ isOpen, onClose, onSubmit, mahasiswaData, existingNIMs }) => {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    status: 'true'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mahasiswaData) {
      setFormData({
        nim: mahasiswaData.nim,
        nama: mahasiswaData.nama,
        status: mahasiswaData.status.toString()
      });
    } else {
      setFormData({
        nim: '',
        nama: '',
        status: 'true'
      });
    }
    setErrors({});
  }, [mahasiswaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nim.trim()) {
      newErrors.nim = 'NIM harus diisi';
    } else if (existingNIMs.includes(formData.nim) && (!mahasiswaData || mahasiswaData.nim !== formData.nim)) {
      newErrors.nim = 'NIM sudah terdaftar';
    }

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mahasiswaData ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              NIM
            </label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.nim ? 'border-red-500' : ''
              }`}
            />
            {errors.nim && (
              <p className="text-red-500 text-xs italic mt-1">{errors.nim}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.nama ? 'border-red-500' : ''
              }`}
            />
            {errors.nama && (
              <p className="text-red-500 text-xs italic mt-1">{errors.nama}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal; 