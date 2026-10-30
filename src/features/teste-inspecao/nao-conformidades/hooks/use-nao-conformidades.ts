import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { naoConformidadesApi } from "../api/nao-conformidades.api";
import type { NaoConformidadeAnexo, NaoConformidadeFiltro, NaoConformidadeRequest } from "../types";

const NAO_CONFORMIDADES_KEY = "nao-conformidades";

export function useNaoConformidadesSearchQuery(
  filtro: NaoConformidadeFiltro,
  page: number,
  size: number,
  enabled = true
) {
  return useQuery({
    queryKey: [NAO_CONFORMIDADES_KEY, "search", filtro, page, size],
    queryFn: () => naoConformidadesApi.search(filtro, page, size),
    enabled,
  });
}

/** Cards e gráficos; `enabled` falso com o período inválido. */
export function useNaoConformidadeIndicadoresQuery(filtro: NaoConformidadeFiltro, enabled = true) {
  return useQuery({
    queryKey: [NAO_CONFORMIDADES_KEY, "indicadores", filtro],
    queryFn: () => naoConformidadesApi.indicadores(filtro),
    enabled,
  });
}

/** Detalhe com anexos; só busca com um id. */
export function useNaoConformidadeQuery(id: string | null) {
  return useQuery({
    queryKey: [NAO_CONFORMIDADES_KEY, "detalhe", id],
    queryFn: () => naoConformidadesApi.findById(id!),
    enabled: !!id,
  });
}

/**
 * Arquivo de um anexo (blob) para pré-visualizar. Fica em cache: a miniatura e o visualizador usam o
 * mesmo download. O arquivo de um anexo não muda, então não precisa recarregar.
 */
export function useAnexoBlobQuery(naoConformidadeId: string, anexo: NaoConformidadeAnexo | null, enabled = true) {
  return useQuery({
    queryKey: [NAO_CONFORMIDADES_KEY, "anexo", naoConformidadeId, anexo?.id],
    queryFn: () => naoConformidadesApi.anexoBlob(naoConformidadeId, anexo!),
    enabled: enabled && !!anexo,
    staleTime: Infinity,
  });
}

function useInvalidateNaoConformidades() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [NAO_CONFORMIDADES_KEY] });
}

export function useCreateNaoConformidadeMutation() {
  const invalidate = useInvalidateNaoConformidades();
  return useMutation({
    mutationFn: ({ data, files }: { data: NaoConformidadeRequest; files: File[] }) =>
      naoConformidadesApi.create(data, files),
    onSuccess: invalidate,
  });
}

export function useUpdateNaoConformidadeMutation() {
  const invalidate = useInvalidateNaoConformidades();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NaoConformidadeRequest }) => naoConformidadesApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteNaoConformidadeMutation() {
  const invalidate = useInvalidateNaoConformidades();
  return useMutation({
    mutationFn: (id: string) => naoConformidadesApi.delete(id),
    onSuccess: invalidate,
  });
}

export function useBaixarAnexoMutation() {
  return useMutation({
    mutationFn: ({ naoConformidadeId, anexo }: { naoConformidadeId: string; anexo: NaoConformidadeAnexo }) =>
      naoConformidadesApi.baixarAnexo(naoConformidadeId, anexo),
  });
}

/** Busca os registros do filtro para montar o PDF (não fica em cache: é um retrato do momento). */
export function useRelatorioNaoConformidadesMutation() {
  return useMutation({ mutationFn: (filtro: NaoConformidadeFiltro) => naoConformidadesApi.listarParaRelatorio(filtro) });
}

export function useExportarNaoConformidadesMutation() {
  return useMutation({ mutationFn: (filtro: NaoConformidadeFiltro) => naoConformidadesApi.exportar(filtro) });
}
