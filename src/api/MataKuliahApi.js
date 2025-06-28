import AxiosInstance from './AxiosInstance';

// Ambil semua mata kuliah
export const getAllMataKuliah = () => AxiosInstance.get("/mata_kuliah");

// Ambil satu mata kuliah
export const getMataKuliah = (id) => AxiosInstance.get(`/mata_kuliah/${id}`);

// Tambah mata kuliah
export const storeMataKuliah = (data) => AxiosInstance.post("/mata_kuliah", data);

// Update mata kuliah
export const updateMataKuliah = (id, data) => AxiosInstance.put(`/mata_kuliah/${id}`, data);

// Hapus mata kuliah
export const deleteMataKuliah = (id) => AxiosInstance.delete(`/mata_kuliah/${id}`);