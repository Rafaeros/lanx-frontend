import { CalendarX, ClipboardList, PackageX, Wallet } from "lucide-react";
import type { CarteiraResumo } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn, formatCurrency } from "@/shared/lib/utils";

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

function percentual(parte: number, total: number): string | undefined {
  return total > 0 ? `${Math.round((parte / total) * 100)}% dos itens` : undefined;
}

/** Totais do período inteiro (vêm do backend; não mudam com a busca da tabela). */
export function CarteiraResumoCards({ resumo }: { resumo: CarteiraResumo }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Indicador label="Itens na carteira" value={String(resumo.itens)} icon={ClipboardList} tone="bg-primary/10 text-primary" />
      <Indicador
        label="Valor total pendente"
        value={formatCurrency(resumo.valorTotal)}
        icon={Wallet}
        tone="bg-success/10 text-success"
      />
      <Indicador
        label="Atrasados"
        value={String(resumo.atrasados)}
        detail={percentual(resumo.atrasados, resumo.itens)}
        icon={CalendarX}
        tone="bg-danger/10 text-danger"
      />
      <Indicador
        label="Com falta de material"
        value={String(resumo.comMaterialPendente)}
        detail={percentual(resumo.comMaterialPendente, resumo.itens)}
        icon={PackageX}
        tone="bg-warning/10 text-warning"
      />
    </div>
  );
}
