import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificacoesApi } from "../api/notificacoes.api";

/** Quantas notificações o painel do sino mostra. */
export const NOTIFICACOES_RECENTES_LIMITE = 10;

const NOTIFICACOES_KEY = "notificacoes";

/** Chaves do cache, compartilhadas com o stream (use-notificacoes-stream) para ele atualizar o mesmo cache. */
export const notificacoesKeys = {
  all: [NOTIFICACOES_KEY] as const,
  recentes: [NOTIFICACOES_KEY, "recentes"] as const,
  naoLidas: [NOTIFICACOES_KEY, "nao-lidas"] as const,
};

/** O número do sino. O stream mantém atualizado: não precisa de polling. */
export function useNotificacoesNaoLidasQuery() {
  return useQuery({
    queryKey: notificacoesKeys.naoLidas,
    queryFn: notificacoesApi.contarNaoLidas,
    select: (data) => data.naoLidas,
  });
}

/** Lista do painel; só busca quando o painel abre. */
export function useNotificacoesRecentesQuery(enabled: boolean) {
  return useQuery({
    queryKey: notificacoesKeys.recentes,
    queryFn: () => notificacoesApi.listar(false, 0, NOTIFICACOES_RECENTES_LIMITE),
    enabled,
  });
}

function useInvalidateNotificacoes() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: notificacoesKeys.all });
}

export function useMarcarNotificacaoComoLidaMutation() {
  const invalidate = useInvalidateNotificacoes();
  return useMutation({
    mutationFn: notificacoesApi.marcarComoLida,
    onSuccess: invalidate,
  });
}

export function useMarcarTodasNotificacoesComoLidasMutation() {
  const invalidate = useInvalidateNotificacoes();
  return useMutation({
    mutationFn: notificacoesApi.marcarTodasComoLidas,
    onSuccess: invalidate,
  });
}
