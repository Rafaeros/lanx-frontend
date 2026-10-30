import { Building2, Percent, ShieldAlert, Tags } from "lucide-react";
import type { NaoConformidadeIndicadores } from "../types";
import { StatCard } from "@/shared/components/ui/stat-card";
import { formatPercentual, formatQuantidade } from "../lib/formato";

/** Indicadores do período: total não conforme, taxa sobre as OPs e quem mais concentra (departamento e tipo). */
export function NaoConformidadeResumo({
  indicadores,
  isLoading,
}: {
  indicadores?: NaoConformidadeIndicadores;
  isLoading?: boolean;
}) {
  const v = (text: string) => (isLoading && !indicadores ? "..." : text);
  const departamento = indicadores?.porDepartamento[0];
  const tipo = indicadores?.porTipo[0];
  const fatia = (g?: { quantidade: number; percentual: number | null }) =>
    g ? `${formatQuantidade(g.quantidade)} peças · ${formatPercentual(g.percentual)} do total` : "Sem registros no período";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Quantidade não conforme"
        value={v(formatQuantidade(indicadores?.quantidadeNaoConforme))}
        valueClassName={indicadores?.quantidadeNaoConforme ? "text-danger" : undefined}
        detail={
          indicadores &&
          `${indicadores.registros} ${indicadores.registros === 1 ? "registro" : "registros"} em ${indicadores.opsAfetadas} ${indicadores.opsAfetadas === 1 ? "OP" : "OPs"}`
        }
        icon={ShieldAlert}
        tone="bg-danger/10 text-danger"
      />
      <StatCard
        label="Taxa de não conformidade"
        value={v(formatPercentual(indicadores?.percentualNaoConforme))}
        detail={
          indicadores && indicadores.quantidadeOps > 0
            ? `sobre ${formatQuantidade(indicadores.quantidadeOps)} peças das OPs afetadas`
            : "Quantidade não conforme ÷ quantidade das OPs"
        }
        icon={Percent}
        tone="bg-warning/10 text-warning"
      />
      <StatCard
        label="Departamento com mais"
        value={v(departamento?.nome ?? "-")}
        detail={indicadores && fatia(departamento)}
        icon={Building2}
        tone="bg-primary/10 text-primary"
      />
      <StatCard
        label="Principal não conformidade"
        value={v(tipo?.nome ?? "-")}
        detail={indicadores && fatia(tipo)}
        icon={Tags}
        tone="bg-info/10 text-info"
      />
    </div>
  );
}
