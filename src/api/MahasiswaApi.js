import AxiosInstance from './AxiosInstance';

// Mengambil semua data mahasiswa dengan support untuk pagination, search, dan sorting
export const getAllMahasiswa = (params = {}) => {
  return AxiosInstance.get('/mahasiswa', { params });
};

// Mengambil satu data mahasiswa berdasarkan ID
export const getMahasiswaById = (id) => {
  return AxiosInstance.get(`/mahasiswa/${id}`);
};

// Menambah mahasiswa baru
export const storeMahasiswa = (data) => {
  return AxiosInstance.post('/mahasiswa', data);
};

// Memperbarui data mahasiswa
export const updateMahasiswa = (id, data) => {
  return AxiosInstance.put(`/mahasiswa/${id}`, data);
};

// Menghapus data mahasiswa
export const deleteMahasiswa = (id) => {
  return AxiosInstance.delete(`/mahasiswa/${id}`);
};

// Mencari user berdasarkan email dan password
export const loginUser = (email, password) => {
    return AxiosInstance.get(`/users?email=${email}&password=${password}`);
  };