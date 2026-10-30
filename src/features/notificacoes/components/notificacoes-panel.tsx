import { BellOff, CheckCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/shared/components/ui/button";
import {
  useMarcarNotificacaoComoLidaMutation,
  useMarcarTodasNotificacoesComoLidasMutation,
  useNotificacoesRecentesQuery,
} from "../hooks/use-notificacoes";
import type { Notificacao } from "../types";
import { NotificacaoItem } from "./notificacao-item";

export interface NotificacoesPanelProps {
  id: string;
  naoLidas: number;
  onClose: () => void;
}

/** Conteúdo do popover do sino: cabeçalho com "marcar todas", lista e estados vazio/carregando/erro. */
export function NotificacoesPanel({ id, naoLidas, onClose }: NotificacoesPanelProps) {
  const navigate = useNavigate();
  const recentes = useNotificacoesRecentesQuery(true);
  const marcarComoLida = useMarcarNotificacaoComoLidaMutation();
  const marcarTodas = useMarcarTodasNotificacoesComoLidasMutation();

  const abrir = (notificacao: Notificacao) => {
    if (!notificacao.lida) marcarComoLida.mutate(notificacao.id);
    onClose();
    if (notificacao.link) navigate(notificacao.link);
  };

  const notificacoes = recentes.data?.items ?? [];

  return (
    <div
      id={id}
      role="dialog"
      aria-label="Notificações"
      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-fade-in"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Notificações</p>
          <p className="text-xs text-muted-foreground">
            {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? "s" : ""}` : "Tudo em dia"}
          </p>
        </div>
        {naoLidas > 0 && (
          <Button variant="ghost" size="sm" onClick={() => marcarTodas.mutate()} isLoading={marcarTodas.isPending}>
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas
          </Button>
        )}
      </div>

      <div className="max-h-[min(28rem,70vh)] divide-y divide-border overflow-y-auto">
        {recentes.isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : recentes.isError ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Não foi possível carregar as notificações.
          </p>
        ) : notificacoes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-muted-foreground">
            <BellOff className="h-6 w-6" />
            <p className="text-sm">Nenhuma notificação por aqui.</p>
          </div>
        ) : (
          notificacoes.map((notificacao) => (
            <NotificacaoItem key={notificacao.id} notificacao={notificacao} onSelect={abrir} />
          ))
        )}
      </div>
    </div>
  );
}
