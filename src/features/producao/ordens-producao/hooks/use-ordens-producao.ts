import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordensProducaoApi } from "../api/ordens-producao.api";
import type { OrdemProducaoFilter, OrdemProducaoRequest } from "../types";

const ORDENS_KEY = "ordens-producao";

export function useOrdensProducaoSearchQuery(filter: OrdemProducaoFilter, page: number, size: number) {
  return useQuery({
    queryKey: [ORDENS_KEY, "search", filter, page, size],
    queryFn: () => ordensProducaoApi.search(filter, page, size),
  });
}

/** Todas as OPs para selects; `enabled` falso quando o perfil não pode ler OPs. */
export function useOrdensProducaoQuery(enabled = true) {
  return useQuery({
    queryKey: [ORDENS_KEY, "all"],
    queryFn: () => ordensProducaoApi.findAll(),
    enabled,
  });
}

function useInvalidateOrdens() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [ORDENS_KEY] });
}

export function useCreateOrdemProducaoMutation() {
  const invalidate = useInvalidateOrdens();
  return useMutation({
    mutationFn: (data: OrdemProducaoRequest) => ordensProducaoApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateOrdemProducaoMutation() {
  const invalidate = useInvalidateOrdens();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrdemProducaoRequest }) => ordensProducaoApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteOrdemProducaoMutation() {
  const invalidate = useInvalidateOrdens();
  return useMutation({
    mutationFn: (id: string) => ordensProducaoApi.delete(id),
    onSuccess: invalidate,
  });
}
