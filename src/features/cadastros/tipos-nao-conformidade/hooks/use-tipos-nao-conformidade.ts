import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tiposNaoConformidadeApi } from "../api/tipos-nao-conformidade.api";
import type { TipoNaoConformidadeFilter, TipoNaoConformidadeRequest } from "../types";

/** Chave raiz: invalida tanto a busca paginada quanto a lista usada no select de não conformidades. */
const TIPOS_NC_KEY = "tipos-nao-conformidade";

export function useTiposNaoConformidadeSearchQuery(filter: TipoNaoConformidadeFilter, page: number, size: number) {
  return useQuery({
    queryKey: [TIPOS_NC_KEY, "search", filter, page, size],
    queryFn: () => tiposNaoConformidadeApi.search(filter, page, size),
  });
}

export function useTiposNaoConformidadeQuery() {
  return useQuery({
    queryKey: [TIPOS_NC_KEY, "all"],
    queryFn: () => tiposNaoConformidadeApi.findAll(),
  });
}

function useInvalidateTiposNaoConformidade() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [TIPOS_NC_KEY] });
    // Não conformidades exibem o nome do tipo
    queryClient.invalidateQueries({ queryKey: ["nao-conformidades"] });
  };
}

export function useCreateTipoNaoConformidadeMutation() {
  const invalidate = useInvalidateTiposNaoConformidade();
  return useMutation({
    mutationFn: (data: TipoNaoConformidadeRequest) => tiposNaoConformidadeApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateTipoNaoConformidadeMutation() {
  const invalidate = useInvalidateTiposNaoConformidade();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TipoNaoConformidadeRequest }) => tiposNaoConformidadeApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteTipoNaoConformidadeMutation() {
  const invalidate = useInvalidateTiposNaoConformidade();
  return useMutation({
    mutationFn: (id: string) => tiposNaoConformidadeApi.delete(id),
    onSuccess: invalidate,
  });
}
