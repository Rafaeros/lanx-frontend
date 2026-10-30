import { Inbox, Loader2 } from "lucide-react";
import type { NaoConformidadeIndicadores } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { NaoConformidadeGrupoChart } from "./nao-conformidade-grupo-chart";
import { NaoConformidadeParetoChart } from "./nao-conformidade-pareto-chart";
import { NaoConformidadeMensalChart } from "./nao-conformidade-mensal-chart";

export interface NaoConformidadePainelProps {
  indicadores?: NaoConformidadeIndicadores;
  isLoading?: boolean;
  emptyMessage: string;
}

/** Visão "Gráficos": por departamento e cliente lado a lado, Pareto dos tipos e a evolução mensal. */
export function NaoConformidadePainel({ indicadores, isLoading, emptyMessage }: NaoConformidadePainelProps) {
  if (isLoading && !indicadores) {
    return (
      <Card>
        <CardContent className="flex h-80 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!indicadores || indicadores.registros === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
          <Inbox className="h-8 w-8 opacity-50" />
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  const total = indicadores.quantidadeNaoConforme;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <NaoConformidadeGrupoChart
          titulo="Quantidade não conforme por departamento"
          unidade={indicadores.porDepartamento.length === 1 ? "departamento" : "departamentos"}
          grupos={indicadores.porDepartamento}
          total={total}
          cor="var(--primary)"
        />
        <NaoConformidadeGrupoChart
          titulo="Quantidade não conforme por cliente"
          unidade={indicadores.porCliente.length === 1 ? "cliente" : "clientes"}
          grupos={indicadores.porCliente}
          total={total}
          cor="var(--info)"
        />
      </div>
      <NaoConformidadeParetoChart tipos={indicadores.porTipo} total={total} />
      <NaoConformidadeMensalChart meses={indicadores.meses} />
    </div>
  );
}
