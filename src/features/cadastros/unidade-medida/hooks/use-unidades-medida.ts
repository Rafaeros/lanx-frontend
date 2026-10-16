import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unidadeMedidaApi } from "../api/unidade-medida.api";
import type { UnidadeMedidaFilter, UnidadeMedidaRequest } from "@/shared/api/schema";

/** Chave raiz: invalida tanto a busca paginada quanto a lista usada no select de materiais. */
const UNIDADES_KEY = "unidadesMedida";

export function useUnidadesMedidaSearchQuery(filter: UnidadeMedidaFilter, page: number, size: number) {
  return useQuery({
    queryKey: [UNIDADES_KEY, "search", filter, page, size],
    queryFn: () => unidadeMedidaApi.search(filter, page, size),
  });
}

function useInvalidateUnidades() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [UNIDADES_KEY] });
    // Materiais exibem nome/sigla da unidade
    queryClient.invalidateQueries({ queryKey: ["materiais"] });
  };
}

export function useCreateUnidadeMedidaMutation() {
  const invalidate = useInvalidateUnidades();
  return useMutation({
    mutationFn: (data: UnidadeMedidaRequest) => unidadeMedidaApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateUnidadeMedidaMutation() {
  const invalidate = useInvalidateUnidades();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UnidadeMedidaRequest }) =>
      unidadeMedidaApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteUnidadeMedidaMutation() {
  const invalidate = useInvalidateUnidades();
  return useMutation({
    mutationFn: (id: string) => unidadeMedidaApi.delete(id),
    onSuccess: invalidate,
  });
}
