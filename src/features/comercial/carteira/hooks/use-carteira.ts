import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CarteiraFiltro } from "../types";
import { carteiraApi } from "../api/carteira.api";

const DEZ_MINUTOS = 10 * 60 * 1000;

/**
 * Carteira do período. A consulta ao ERP é lenta, então o resultado fica 10 min "fresco" (igual ao
 * cache do backend): voltar à tela não consulta de novo. `atualizar()` força uma nova leitura do ERP.
 */
export function useCarteiraQuery(filtro: CarteiraFiltro, enabled = true) {
  const forcar = React.useRef(false);
  const query = useQuery({
    queryKey: ["carteira", filtro],
    queryFn: ({ signal }) => {
      const atualizar = forcar.current;
      forcar.current = false;
      return carteiraApi.consultar(filtro, atualizar, signal);
    },
    enabled,
    staleTime: DEZ_MINUTOS,
    gcTime: 3 * DEZ_MINUTOS,
    retry: false,
  });

  const { refetch } = query;
  const atualizar = React.useCallback(() => {
    forcar.current = true;
    return refetch();
  }, [refetch]);

  return { ...query, atualizar };
}

export function useExportarCarteiraMutation() {
  return useMutation({ mutationFn: (filtro: CarteiraFiltro) => carteiraApi.exportar(filtro) });
}
