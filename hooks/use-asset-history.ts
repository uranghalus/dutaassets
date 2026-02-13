import { useQuery } from '@tanstack/react-query';
import { getAssetHistory } from '@/action/asset-history-action';

export function useAssetHistory({
  assetId,
  search,
  page,
  pageSize,
}: {
  assetId?: string;
  search?: string;
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ['asset-history', assetId, search, page, pageSize],
    queryFn: () =>
      getAssetHistory({
        assetId,
        search,
        page,
        pageSize,
      }),
  });
}
