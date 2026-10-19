import { Inbox, Loader2 } from "lucide-react";
import type { IqfMesResponse } from "@/shared/api/schema";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { formatMes, formatPercentual, tomDoMes } from "../lib/classificacao";
import { IqfMensalChart } from "./iqf-mensal-chart";

export interface IqfMensalPainelProps {
  meses: IqfMesResponse[];
  isLoading?: boolean;
  emptyMessage: string;
  /** Meta mensal (IQF geral). Sem ela, o painel mostra as faixas A/B/C (visão do fornecedor). */
  meta?: number;
}

const LEGENDA_FAIXAS = [
  { label: "A · Qualificado (≥ 84%)", className: "bg-success" },
  { label: "B · Em atenção (≥ 75%)", className: "bg-warning" },
  { label: "C · Crítico (< 75%)", className: "bg-danger" },
  { label: "Sem avaliação", className: "bg-muted-foreground/40" },
];

function legendaMeta(meta: number) {
  return [
    { label: `Meta atingida (≥ ${meta}%)`, className: "bg-success" },
    { label: `Abaixo da meta (< ${meta}%)`, className: "bg-danger" },
    { label: "Sem avaliação", className: "bg-muted-foreground/40" },
  ];
}

/** Visão "Gráfico mensal": IQF de cada mês do período + a mesma informação em tabela. */
export function IqfMensalPainel({ meses, isLoading, emptyMessage, meta }: IqfMensalPainelProps) {
  const avaliados = meses.filter((m) => m.entregasAvaliadas > 0);
  const naMeta = avaliados.filter((m) => m.atingiuMeta).length;
  const legenda = meta != null ? legendaMeta(meta) : LEGENDA_FAIXAS;

  if (isLoading && meses.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-80 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (avaliados.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
          <Inbox className="h-8 w-8 opacity-50" />
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">IQF mês a mês</h3>
            <p className="text-xs text-muted-foreground">
              % de entregas no prazo, pela previsão de entrega · {meses.length}{" "}
              {meses.length === 1 ? "mês" : "meses"} no período
            </p>
            {meta != null && (
              <p className="mt-1 text-xs font-medium text-foreground">
                Meta mensal de {meta}%:{" "}
                <span className={naMeta === avaliados.length ? "text-success" : "text-danger"}>
                  {naMeta} de {avaliados.length} {avaliados.length === 1 ? "mês avaliado" : "meses avaliados"} na meta
                </span>
              </p>
            )}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {legenda.map((l) => (
              <li key={l.label} className="inline-flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-sm", l.className)} aria-hidden />
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        <IqfMensalChart meses={meses} height={340} meta={meta} />

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-max text-xs">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th scope="row" className="sticky left-0 bg-muted px-3 py-2 text-left font-medium">
                  Mês
                </th>
                {meses.map((m) => (
                  <th key={m.mes} scope="col" className="px-3 py-2 text-right font-medium">
                    {formatMes(m.mes)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              <tr>
                <th scope="row" className="sticky left-0 bg-card px-3 py-2 text-left font-medium text-foreground">
                  IQF
                </th>
                {meses.map((m) => (
                  <td
                    key={m.mes}
                    className={cn(
                      "px-3 py-2 text-right font-semibold",
                      tomDoMes(m, meta != null)
                    )}
                  >
                    {formatPercentual(m.percentualNoPrazo)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 bg-card px-3 py-2 text-left font-medium text-muted-foreground">
                  Avaliadas
                </th>
                {meses.map((m) => (
                  <td key={m.mes} className="px-3 py-2 text-right text-foreground">
                    {m.entregasAvaliadas}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 bg-card px-3 py-2 text-left font-medium text-muted-foreground">
                  Atrasadas
                </th>
                {meses.map((m) => (
                  <td key={m.mes} className={cn("px-3 py-2 text-right", m.entregasAtrasadas > 0 && "text-danger")}>
                    {m.entregasAtrasadas}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
