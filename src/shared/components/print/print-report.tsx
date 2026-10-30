import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";

/** Classes das tabelas dos relatórios impressos (mesmo visual em todos). */
export const printTh = "border-b border-border px-1.5 py-1 text-left font-semibold";
export const printTd = "border-b border-border px-1.5 py-1 align-top tabular-nums";

export interface PrintStat {
  label: string;
  value: string;
  /** Classe de cor do valor, ex.: "text-danger". */
  tone?: string;
}

export interface PrintReportProps {
  /** Linha pequena acima do título, ex.: "LANX · Qualidade". */
  kicker: string;
  title: string;
  /** Período e filtros, abaixo do título. */
  subtitle?: React.ReactNode;
  /** Texto à direita do cabeçalho (legenda, origem dos dados). "Gerado em" já vem incluso. */
  meta?: React.ReactNode;
  /** Cards de indicadores logo abaixo do cabeçalho. */
  stats?: PrintStat[];
  children: React.ReactNode;
  /** Chamado depois que o diálogo de impressão fecha. */
  onDone: () => void;
}

/**
 * Relatório para "Salvar como PDF": renderizado em #print-root, fora do app (só aparece na impressão,
 * ver @media print em app.css, sempre no tema claro e em A4 paisagem). Cuida do cabeçalho com a logo
 * LANX e de abrir o diálogo de impressão só com a logo carregada (senão ela sai em branco no PDF).
 * Gráficos dentro dele precisam de largura fixa (o #print-root fica oculto na tela).
 */
export function PrintReport({ kicker, title, subtitle, meta, stats, children, onDone }: PrintReportProps) {
  const [root] = React.useState(() => {
    const el = document.createElement("div");
    el.id = "print-root";
    return el;
  });
  const [logoPronta, setLogoPronta] = React.useState(false);

  React.useEffect(() => {
    document.body.appendChild(root);
    return () => root.remove();
  }, [root]);

  React.useEffect(() => {
    if (!logoPronta) return;
    const finish = () => onDone();
    window.addEventListener("afterprint", finish);
    // dois frames: gráficos (SVG de largura fixa) e tabelas já estão no DOM quando o diálogo abre
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => window.print());
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", finish);
    };
  }, [logoPronta, onDone]);

  return createPortal(
    <div className="bg-white p-2 text-[10px] text-foreground">
      <header className="flex items-end justify-between gap-4 border-b-2 border-primary pb-2">
        <div className="flex items-end gap-4">
          <img
            src="/brand/logo.png"
            alt="LANX Cables"
            className="h-10 w-auto"
            onLoad={() => setLogoPronta(true)}
            onError={() => setLogoPronta(true)}
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{kicker}</p>
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <p className="text-right text-[10px] text-muted-foreground">
          Gerado em {new Date().toLocaleString("pt-BR")}
          {meta && (
            <>
              <br />
              {meta}
            </>
          )}
        </p>
      </header>

      {stats && stats.length > 0 && (
        <section className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border border-border px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className={cn("truncate font-display text-base font-semibold tabular-nums", s.tone)}>{s.value}</p>
            </div>
          ))}
        </section>
      )}

      {children}
    </div>,
    root
  );
}

/** Bloco do relatório com título; `keepTogether` evita quebrar de página no meio (gráficos). */
export function PrintSection({
  title,
  keepTogether,
  className,
  children,
}: {
  title: React.ReactNode;
  keepTogether?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("mt-4", keepTogether && "break-inside-avoid", className)}>
      <h2 className="mb-1 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
