import { useQuery } from '@tanstack/react-query';
import { getAllKelas } from '../api/KelasApi';

export const useKelas = () =>
  useQuery({
    queryKey: ['kelas'],
    queryFn: getAllKelas,
    select: (res) => res?.data ?? [],
  });