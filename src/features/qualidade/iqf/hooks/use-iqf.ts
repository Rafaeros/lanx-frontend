import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { IqfFiltro } from "../types";
import { iqfApi } from "../api/iqf.api";

export function useIqfQuery(filtro: IqfFiltro, enabled = true) {
  return useQuery({
    queryKey: ["iqf", filtro],
    queryFn: () => iqfApi.consultar(filtro),
    placeholderData: keepPreviousData,
    enabled,
  });
}

/** IQF mês a mês de um fornecedor (modal); `null` não consulta. */
export function useIqfFornecedorQuery(fornecedorId: string | null, filtro: IqfFiltro) {
  return useQuery({
    queryKey: ["iqf", "fornecedor", fornecedorId, filtro],
    queryFn: () => iqfApi.consultarFornecedor(fornecedorId!, filtro),
    enabled: !!fornecedorId,
  });
}

/** Rateios mudam só quando há importação: cache longo. */
export function useIqfRateiosQuery() {
  return useQuery({
    queryKey: ["iqf", "rateios"],
    queryFn: iqfApi.rateios,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExportarIqfMutation() {
  return useMutation({ mutationFn: (filtro: IqfFiltro) => iqfApi.exportar(filtro) });
}
