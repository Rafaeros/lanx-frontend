import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeEventStream } from "@/shared/api/event-stream";
import { useToast } from "@/shared/components/ui/toast";
import type { PageResult } from "@/shared/types";
import { NOTIFICACAO_EVENTO, NOTIFICACOES_STREAM_PATH } from "../api/notificacoes.api";
import type { Notificacao } from "../types";
import { notificacoesKeys } from "./use-notificacoes";

/**
 * Mantém o cache de notificações em dia pelo SSE do backend:
 * - notificação nova → entra no topo da lista do painel, recarrega o contador e mostra um toast;
 * - (re)conexão → recarrega tudo, porque algo pode ter chegado enquanto a conexão estava caída.
 * Monte uma vez só, no layout autenticado.
 */
export function useNotificacoesStream() {
  const queryClient = useQueryClient();
  const toast = useToast();
  // o toast muda de identidade a cada render do provider; a assinatura não deve reabrir por isso
  const toastRef = React.useRef(toast);
  toastRef.current = toast;

  React.useEffect(() => {
    return subscribeEventStream(NOTIFICACOES_STREAM_PATH, {
      onOpen: () => queryClient.invalidateQueries({ queryKey: notificacoesKeys.all }),
      onEvent: ({ event, data }) => {
        if (event !== NOTIFICACAO_EVENTO) return;
        const notificacao = JSON.parse(data) as Notificacao;

        queryClient.setQueryData<PageResult<Notificacao>>(notificacoesKeys.recentes, (atual) =>
          atual
            ? {
                ...atual,
                items: [notificacao, ...atual.items.filter((n) => n.id !== notificacao.id)].slice(0, atual.size),
                totalElements: atual.totalElements + 1,
              }
            : atual
        );
        queryClient.invalidateQueries({ queryKey: notificacoesKeys.naoLidas });
        toastRef.current.info(notificacao.titulo, notificacao.mensagem);
      },
    });
  }, [queryClient]);
}
