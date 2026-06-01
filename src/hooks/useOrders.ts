import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOrder, fetchMyOrders } from '../api/orders';
import { mapOrder } from '../lib/catalogMappers';

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => (await fetchMyOrders()).map(mapOrder),
    refetchInterval: 30_000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}
