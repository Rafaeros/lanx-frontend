import * as React from "react";
import { CalendarSearch, Loader2 } from "lucide-react";

const ETAPAS = [
  "Buscando os pedidos pendentes no ERP",
  "Lendo a etapa atual de cada OP",
  "Cruzando as requisições de material pendentes",
];

/**
 * Estado de carregamento da carteira. A consulta passa pelo cg-scraper e pode levar 1 a 2 minutos,
 * então mostra o tempo decorrido e o que está sendo feito, para o usuário não achar que travou.
 */
export function CarteiraCarregando({ desde }: { desde: number }) {
  const [agora, setAgora] = React.useState(() => Date.now());

  React.useEffect(() => {
    const timer = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const segundos = Math.max(0, Math.floor((agora - desde) / 1000));
  const decorrido = segundos < 60 ? `${segundos}s` : `${Math.floor(segundos / 60)}min ${segundos % 60}s`;
  // só ilustra o andamento: o backend não informa a etapa real
  const etapa = Math.min(ETAPAS.length - 1, Math.floor(segundos / 20));

  return (
    <section
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card px-6 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-foreground">Consultando a carteira no ERP…</p>
        <p className="text-sm text-muted-foreground">
          {ETAPAS[etapa]} · <span className="tabular-nums">{decorrido}</span>
        </p>
      </div>
      <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full w-1/3 animate-indeterminate rounded-full bg-brand-gradient" />
      </div>
      <p className="max-w-md text-xs text-muted-foreground">
        Os pedidos, as etapas das OPs e os materiais faltantes são cruzados na hora. Períodos longos podem levar
        1 a 2 minutos; depois disso a consulta fica guardada por 10 minutos.
      </p>
    </section>
  );
}

/** Faixa mostrada enquanto o ERP é consultado de novo, com os dados anteriores ainda na tela. */
export function CarteiraAtualizando() {
  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-xl border border-info/30 bg-info/10 px-4 py-2.5 text-sm text-foreground"
    >
      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-info" />
      Atualizando a partir do ERP… os dados abaixo são da consulta anterior.
    </div>
  );
}

/** Antes da primeira consulta: a tela espera o usuário escolher o período e clicar em Consultar. */
export function CarteiraAguardando() {
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarSearch className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-foreground">Escolha o período da carteira</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Selecione um atalho ou as datas acima e clique em{" "}
          <span className="font-medium text-foreground">Consultar</span>. Os pedidos são buscados direto no ERP;
          períodos longos podem levar até 2 minutos.
        </p>
      </div>
    </section>
  );
}
