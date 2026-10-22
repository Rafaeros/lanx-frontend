import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateiosApi } from "../api/rateios.api";
import type { RateioFilter, RateioRequest } from "../types";

/** Chave raiz: invalida a busca paginada e a lista usada nos filtros dos relatórios. */
const RATEIOS_KEY = "rateios";

export function useRateiosSearchQuery(filter: RateioFilter, page: number, size: number) {
  return useQuery({
    queryKey: [RATEIOS_KEY, "search", filter, page, size],
    queryFn: () => rateiosApi.search(filter, page, size),
  });
}

export function useRateiosQuery() {
  return useQuery({
    queryKey: [RATEIOS_KEY, "all"],
    queryFn: () => rateiosApi.findAll(),
  });
}

function useInvalidateRateios() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [RATEIOS_KEY] });
    // Itens da análise de pedidos e o IQF exibem/filtram pelo nome do rateio
    queryClient.invalidateQueries({ queryKey: ["analise-pedidos"] });
    queryClient.invalidateQueries({ queryKey: ["iqf"] });
  };
}

export function useCreateRateioMutation() {
  const invalidate = useInvalidateRateios();
  return useMutation({
    mutationFn: (data: RateioRequest) => rateiosApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateRateioMutation() {
  const invalidate = useInvalidateRateios();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RateioRequest }) => rateiosApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteRateioMutation() {
  const invalidate = useInvalidateRateios();
  return useMutation({
    mutationFn: (id: string) => rateiosApi.delete(id),
    onSuccess: invalidate,
  });
}
