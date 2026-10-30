import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDismiss } from "@/shared/hooks/use-dismiss";
import { useNotificacoesNaoLidasQuery } from "../hooks/use-notificacoes";
import { useNotificacoesStream } from "../hooks/use-notificacoes-stream";
import { NotificacoesPanel } from "./notificacoes-panel";

/** Acima disso o contador mostra "99+". */
const CONTADOR_MAX = 99;

/**
 * Sino do header: contador de não lidas + painel com as recentes.
 * Fica no layout autenticado, então também é ele que mantém a conexão SSE aberta enquanto o usuário está logado.
 */
export function NotificacoesBell() {
  useNotificacoesStream();

  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();
  const close = React.useCallback(() => setOpen(false), []);
  useDismiss(containerRef, open, close);

  const naoLidas = useNotificacoesNaoLidasQuery().data ?? 0;
  const contador = naoLidas > CONTADOR_MAX ? `${CONTADOR_MAX}+` : String(naoLidas);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={naoLidas > 0 ? `Notificações: ${naoLidas} não lidas` : "Notificações"}
        title="Notificações"
        className="relative"
      >
        <Bell className="h-[18px] w-[18px] text-muted-foreground" />
        {naoLidas > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
            {contador}
          </span>
        )}
      </Button>

      {open && <NotificacoesPanel id={panelId} naoLidas={naoLidas} onClose={close} />}
    </div>
  );
}
