import React, { useState, useEffect } from 'react';
import { getAllMataKuliah, storeMataKuliah, updateMataKuliah, deleteMataKuliah } from '../api/MataKuliahApi';
import { formatDataWithId } from '../helpers/idHelper';

const MataKuliahPage = () => {
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [formData, setFormData] = useState({ name: '', sks: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  const fetchMataKuliah = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllMataKuliah();
      setMataKuliahList(response.data);
    } catch (err) {
      setError('Gagal mengambil data mata kuliah');
      console.error('Error fetching mata kuliah:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'sks' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        await updateMataKuliah(editingId, formData);
      } else {
        // Format data with sequential ID before sending
        const dataWithId = formatDataWithId(formData, mataKuliahList);
        await storeMataKuliah(dataWithId);
      }
      
      setFormData({ name: '', sks: '' });
      setEditingId(null);
      fetchMataKuliah();
    } catch (err) {
      setError(editingId ? 'Gagal mengupdate mata kuliah' : 'Gagal menambahkan mata kuliah');
      console.error('Error saving mata kuliah:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mataKuliah) => {
    setFormData({ name: mataKuliah.name, sks: mataKuliah.sks });
    setEditingId(mataKuliah.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
      setLoading(true);
      try {
        await deleteMataKuliah(id);
        fetchMataKuliah();
      } catch (err) {
        setError('Gagal menghapus mata kuliah');
        console.error('Error deleting mata kuliah:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', sks: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Mata Kuliah</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama Mata Kuliah"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="sks"
            value={formData.sks}
            onChange={handleInputChange}
            placeholder="Jumlah SKS"
            className="border rounded px-3 py-2"
            required
            min="1"
            max="6"
          />
        </div>
        
        <div className="mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (editingId ? 'Update' : 'Tambah')}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Daftar Mata Kuliah</h2>
        
        {loading && !editingId ? (
          <p className="p-4">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Mata Kuliah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mataKuliahList.map(mataKuliah => (
                  <tr key={mataKuliah.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mataKuliah.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mataKuliah.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mataKuliah.sks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(mataKuliah)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mataKuliah.id)}
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
        )}
      </div>
    </div>
  );
};

export default MataKuliahPage;