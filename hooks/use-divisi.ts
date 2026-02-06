
import { useQuery } from '@tanstack/react-query';
import { getDivisis } from '@/action/divisi-action';

export function useDivisis() {
  return useQuery({
    queryKey: ['divisis'],
    queryFn: () => getDivisis(),
  });
}
