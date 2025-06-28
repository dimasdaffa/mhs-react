import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from '../api/MahasiswaApi';
import { showSuccessToast, showErrorToast } from '../helpers/toastHelper';

// Ambil semua mahasiswa dengan pagination, search, dan sorting
export const useMahasiswa = (query = {}) =>
  useQuery({
    queryKey: ['mahasiswa', query],
    queryFn: () => getAllMahasiswa(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res.headers['x-total-count'] ?? '0', 10),
    }),
    keepPreviousData: true,
  });

// Tambah
export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
      showSuccessToast('Mahasiswa berhasil ditambahkan!');
    },
    onError: () => showErrorToast('Gagal menambahkan mahasiswa.'),
  });
};

// Edit
export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
      showSuccessToast('Mahasiswa berhasil diperbarui!');
    },
    onError: () => showErrorToast('Gagal memperbarui mahasiswa.'),
  });
};

// Hapus
export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
      showSuccessToast('Mahasiswa berhasil dihapus!');
    },
    onError: () => showErrorToast('Gagal menghapus mahasiswa.'),
  });
};