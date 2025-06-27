import AxiosInstance from './AxiosInstance';

// Ambil semua kelas
export const getAllKelas = () => AxiosInstance.get("/kelas");

// Ambil 1 kelas
export const getKelas = (id) => AxiosInstance.get(`/kelas/${id}`);

// Tambah kelas baru
export const storeKelas = (data) => AxiosInstance.post("/kelas", data);

// Update kelas
export const updateKelas = (id, data) => AxiosInstance.put(`/kelas/${id}`, data);

// Hapus kelas
export const deleteKelas = (id) => AxiosInstance.delete(`/kelas/${id}`);