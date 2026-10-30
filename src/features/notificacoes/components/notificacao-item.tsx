import { cn } from "@/shared/lib/utils";
import { formatRelativo } from "@/shared/lib/date";
import { iconeDaNotificacao } from "../lib/tipo-notificacao";
import type { Notificacao } from "../types";

export interface NotificacaoItemProps {
  notificacao: Notificacao;
  onSelect: (notificacao: Notificacao) => void;
}

/** Uma linha do painel. Não lida = fundo destacado e ponto à direita. */
export function NotificacaoItem({ notificacao, onSelect }: NotificacaoItemProps) {
  const Icone = iconeDaNotificacao(notificacao.tipo);

  return (
    <button
      type="button"
      onClick={() => onSelect(notificacao)}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
        !notificacao.lida && "bg-primary/5"
      )}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icone className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm text-foreground", !notificacao.lida && "font-semibold")}>
          {notificacao.titulo}
        </span>
        <span className="line-clamp-2 text-xs text-muted-foreground">{notificacao.mensagem}</span>
        <span className="mt-1 block text-[11px] text-muted-foreground/80">{formatRelativo(notificacao.createdAt)}</span>
      </span>
      {!notificacao.lida && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
    </button>
  );
}
