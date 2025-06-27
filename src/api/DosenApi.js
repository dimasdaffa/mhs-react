import AxiosInstance from './AxiosInstance';

// Ambil semua dosen
export const getAllDosen = () => AxiosInstance.get("/dosen");

// Ambil 1 dosen
export const getDosen = (id) => AxiosInstance.get(`/dosen/${id}`);

// Tambah dosen
export const storeDosen = (data) => AxiosInstance.post("/dosen", data);

// Update dosen
export const updateDosen = (id, data) => AxiosInstance.put(`/dosen/${id}`, data);

// Hapus dosen
export const deleteDosen = (id) => AxiosInstance.delete(`/dosen/${id}`);