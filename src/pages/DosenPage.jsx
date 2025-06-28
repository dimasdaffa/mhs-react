import React, { useState, useEffect } from 'react';
import { getAllDosen, storeDosen, updateDosen, deleteDosen } from '../api/DosenApi';
import { formatDataWithId } from '../helpers/idHelper';

const DosenPage = () => {
  const [dosenList, setDosenList] = useState([]);
  const [formData, setFormData] = useState({ name: '', max_sks: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDosen();
  }, []);

  const fetchDosen = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDosen();
      setDosenList(response.data);
    } catch (err) {
      setError('Gagal mengambil data dosen');
      console.error('Error fetching dosen:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'max_sks' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        await updateDosen(editingId, formData);
      } else {
        // Format data with sequential ID before sending
        const dataWithId = formatDataWithId(formData, dosenList);
        await storeDosen(dataWithId);
      }
      
      setFormData({ name: '', max_sks: '' });
      setEditingId(null);
      fetchDosen();
    } catch (err) {
      setError(editingId ? 'Gagal mengupdate dosen' : 'Gagal menambahkan dosen');
      console.error('Error saving dosen:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dosen) => {
    setFormData({ name: dosen.name, max_sks: dosen.max_sks });
    setEditingId(dosen.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dosen ini?')) {
      setLoading(true);
      try {
        await deleteDosen(id);
        fetchDosen();
      } catch (err) {
        setError('Gagal menghapus dosen');
        console.error('Error deleting dosen:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', max_sks: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Dosen</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Dosen' : 'Tambah Dosen Baru'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama Dosen"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="max_sks"
            value={formData.max_sks}
            onChange={handleInputChange}
            placeholder="Maksimal SKS"
            className="border rounded px-3 py-2"
            required
            min="1"
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
        <h2 className="text-lg font-semibold p-4 border-b">Daftar Dosen</h2>
        
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
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max SKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dosenList.map(dosen => (
                  <tr key={dosen.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dosen.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dosen.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dosen.max_sks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(dosen)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dosen.id)}
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

export default DosenPage;