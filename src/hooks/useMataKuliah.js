import { useQuery } from '@tanstack/react-query';
import { getAllMataKuliah } from '../api/MataKuliahApi';

export const useMataKuliah = () =>
  useQuery({
    queryKey: ['mata-kuliah'],
    queryFn: getAllMataKuliah,
    select: (res) => res?.data ?? [],
  });