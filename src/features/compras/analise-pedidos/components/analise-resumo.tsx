import { AlertTriangle, Clock, DollarSign, Package } from "lucide-react";
import type { ResumoAnalisePedidosResponse } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

interface IndicadorProps {
  label: string;
  value: string;
  detail?: string;
  icon: React.ElementType;
  tone: string;
}

function Indicador({ label, value, detail, icon: Icon, tone }: IndicadorProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 truncate font-display text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Indicadores do período filtrado, vindos de /resumo (somam todas as páginas). */
export function AnaliseResumo({ resumo, isLoading }: { resumo?: ResumoAnalisePedidosResponse; isLoading?: boolean }) {
  const v = (text: string) => (isLoading && !resumo ? "..." : text);
  const r = resumo;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Indicador
        label="Itens de pedido"
        value={v(String(r?.totalItens ?? 0))}
        detail={r ? `${r.atendidos} atendidos` : undefined}
        icon={Package}
        tone="bg-info/10 text-info"
      />
      <Indicador
        label="Valor total"
        value={v(formatCurrency(r?.valorTotal ?? 0))}
        icon={DollarSign}
        tone="bg-success/10 text-success"
      />
      <Indicador
        label="Pendentes e parciais"
        value={v(String((r?.pendentes ?? 0) + (r?.parciais ?? 0)))}
        detail={r ? `${r.pendentes} pendentes, ${r.parciais} parciais` : undefined}
        icon={AlertTriangle}
        tone="bg-warning/10 text-warning"
      />
      <Indicador
        label="Lead time médio"
        value={v(r?.leadTimeMedioDias != null ? `${r.leadTimeMedioDias} dias` : "-")}
        detail="Da emissão do PC até a entrega"
        icon={Clock}
        tone="bg-primary/10 text-primary"
      />
    </div>
  );
}
