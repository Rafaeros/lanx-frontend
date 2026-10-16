import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalisePedidosFiltro } from "@/shared/api/schema";
import { analisePedidosApi } from "../api/analise-pedidos.api";

const KEY = "analise-pedidos";

export function useAnalisePedidosQuery(filtro: AnalisePedidosFiltro, page: number, size: number, enabled = true) {
  return useQuery({
    queryKey: [KEY, "itens", filtro, page, size],
    queryFn: () => analisePedidosApi.consultar(filtro, page, size),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useResumoAnalisePedidosQuery(filtro: AnalisePedidosFiltro, enabled = true) {
  return useQuery({
    queryKey: [KEY, "resumo", filtro],
    queryFn: () => analisePedidosApi.resumo(filtro),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useImportarPedidosMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dataInicio, dataFim }: { dataInicio: string; dataFim: string }) =>
      analisePedidosApi.importar(dataInicio, dataFim),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
