import { CalendarCheck, CalendarX, Gauge, PackageCheck } from "lucide-react";
import type { IqfResponse } from "../types";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { FAIXA_BADGE, FAIXA_CRITERIO, FAIXA_LABELS, FAIXA_TONE, formatPercentual } from "../lib/classificacao";

interface IndicadorProps {
  label: string;
  value: string;
  detail?: React.ReactNode;
  icon: React.ElementType;
  tone: string;
  valueClassName?: string;
}

function Indicador({ label, value, detail, icon: Icon, tone, valueClassName }: IndicadorProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1 truncate font-display text-2xl font-semibold tabular-nums text-foreground",
              valueClassName
            )}
          >
            {value}
          </p>
          {detail && <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Indicadores gerais do período: IQF consolidado e contagem de entregas avaliadas. */
export function IqfResumo({ iqf, isLoading }: { iqf?: IqfResponse; isLoading?: boolean }) {
  const v = (text: string) => (isLoading && !iqf ? "..." : text);
  const faixa = iqf?.classificacao?.faixa;
  const pct = (n: number) => (iqf && iqf.entregasAvaliadas > 0 ? `${Math.round((n / iqf.entregasAvaliadas) * 100)}% das avaliadas` : undefined);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Indicador
        label="IQF geral (prazo)"
        value={v(formatPercentual(iqf?.percentualNoPrazo))}
        valueClassName={faixa ? FAIXA_TONE[faixa].text : undefined}
        detail={
          faixa ? (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant={FAIXA_BADGE[faixa]}>{FAIXA_LABELS[faixa]}</Badge>
              {iqf?.percentualNoPrazo != null && (
                <span className={iqf.percentualNoPrazo >= iqf.metaMensal ? "text-success" : "text-danger"}>
                  Meta {iqf.metaMensal}%: {iqf.percentualNoPrazo >= iqf.metaMensal ? "atingida" : "abaixo"}
                </span>
              )}
            </div>
          ) : (
            FAIXA_CRITERIO
          )
        }
        icon={Gauge}
        tone="bg-primary/10 text-primary"
      />
      <Indicador
        label="Entregas avaliadas"
        value={v(String(iqf?.entregasAvaliadas ?? 0))}
        detail={iqf ? `${iqf.fornecedores.length} fornecedores no período` : undefined}
        icon={PackageCheck}
        tone="bg-info/10 text-info"
      />
      <Indicador
        label="No prazo"
        value={v(String(iqf?.entregasNoPrazo ?? 0))}
        detail={iqf ? pct(iqf.entregasNoPrazo) : undefined}
        icon={CalendarCheck}
        tone="bg-success/10 text-success"
      />
      <Indicador
        label="Atrasadas"
        value={v(String(iqf?.entregasAtrasadas ?? 0))}
        detail={iqf ? pct(iqf.entregasAtrasadas) : undefined}
        icon={CalendarX}
        tone="bg-danger/10 text-danger"
      />
    </div>
  );
}
