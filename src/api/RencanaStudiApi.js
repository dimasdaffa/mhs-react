import AxiosInstance from './AxiosInstance';

// --- API Dosen ---
export const getAllDosen = () => AxiosInstance.get('/dosen');

// --- API Mata Kuliah ---
export const getAllMataKuliah = () => AxiosInstance.get('/mata_kuliah');

// --- API Kelas ---
export const getAllKelas = () => AxiosInstance.get('/kelas');
export const storeKelas = (data) => AxiosInstance.post('/kelas', data);
export const updateKelas = (id, data) => AxiosInstance.put(`/kelas/${id}`, data);
export const deleteKelas = (id) => AxiosInstance.delete(`/kelas/${id}`);