import * as React from "react";
import { CalendarRange, Database, Search } from "lucide-react";
import type { CarteiraFiltro } from "../types";
import { PRESETS, periodoDoPreset, presetDoPeriodo } from "@/shared/lib/periodo";
import { Button } from "@/shared/components/ui/button";
import { IntervaloDatasInput } from "@/shared/components/ui/intervalo-datas";
import { Segmented } from "@/shared/components/ui/segmented";
import { formatDataHora } from "../lib/carteira";

export function periodoValido(p: CarteiraFiltro) {
  return !!p.dataInicio && !!p.dataFim && p.dataInicio <= p.dataFim;
}

export interface CarteiraPeriodoFiltroProps {
  /** Período da última consulta enviada ao ERP; null antes da primeira. */
  periodo: CarteiraFiltro | null;
  onConsultar: (periodo: CarteiraFiltro) => void;
  /** Quando os dados exibidos foram lidos do ERP, se já houver consulta. */
  consultadoEm?: string;
}

/**
 * Único filtro que vai ao ERP. Nada é consultado ao abrir a tela nem ao escolher um atalho:
 * o usuário monta o período e clica em "Consultar", porque cada consulta leva de 20 s a 2 min.
 */
export function CarteiraPeriodoFiltro({ periodo, onConsultar, consultadoEm }: CarteiraPeriodoFiltroProps) {
  const [rascunho, setRascunho] = React.useState<CarteiraFiltro>(() => periodo ?? periodoDoPreset("mes"));
  React.useEffect(() => {
    if (periodo) setRascunho(periodo);
  }, [periodo]);

  const valido = periodoValido(rascunho);
  const alterado = !periodo || rascunho.dataInicio !== periodo.dataInicio || rascunho.dataFim !== periodo.dataFim;

  return (
    <section className="rounded-xl border border-border bg-card">
      <form
        className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          if (valido && alterado) onConsultar(rascunho);
        }}
      >
        <div className="min-w-0 space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Período rápido</span>
          <div className="overflow-x-auto">
            <Segmented
              label="Período rápido"
              options={PRESETS}
              value={presetDoPeriodo(rascunho)}
              onChange={(id) => setRascunho(periodoDoPreset(id))}
              stretch
              className="w-full min-w-max lg:w-auto"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5" />
            Período personalizado
          </span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <IntervaloDatasInput value={rascunho} onChange={setRascunho} invalido={!valido} />
            <Button type="submit" size="sm" className="h-9 w-full shrink-0 sm:w-auto" disabled={!valido || !alterado}>
              <Search className="h-4 w-4" />
              Consultar
            </Button>
          </div>
        </div>
      </form>

      <div className="border-t border-border px-4 py-2.5 sm:px-5">
        {!valido ? (
          <p className="text-xs font-medium text-danger">A data inicial precisa ser anterior ou igual à final.</p>
        ) : !periodo ? (
          <p className="text-xs text-muted-foreground">
            Escolha o período e clique em Consultar. A consulta ao ERP leva de 20 segundos a 2 minutos.
          </p>
        ) : alterado ? (
          <p className="text-xs text-muted-foreground">Clique em Consultar para buscar o novo período no ERP.</p>
        ) : consultadoEm ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5 shrink-0" />
            Dados do ERP de {formatDataHora(consultadoEm)}. Use Atualizar para buscar de novo.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Os pedidos do período são consultados direto no ERP.</p>
        )}
      </div>
    </section>
  );
}
