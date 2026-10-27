import { Search, X } from "lucide-react";
import type { SituacaoPedido } from "../types";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import { SITUACAO_LABELS } from "../lib/situacao";
import { useAnaliseRateiosQuery } from "../hooks/use-analise-pedidos";
import { rateioOptions } from "../../shared/rateios";
import { RateiosSelecionados } from "../../shared/components/rateios-selecionados";

export interface AnaliseFiltrosValue {
  dataInicio: string;
  dataFim: string;
  busca: string;
  situacao: SituacaoPedido | "";
  /** Ids dos rateios; vazio = todos. */
  rateios: string[];
}

export interface AnaliseFiltrosProps {
  value: AnaliseFiltrosValue;
  onChange: (value: AnaliseFiltrosValue) => void;
  onClear: () => void;
  periodoInvalido: boolean;
}

const SITUACOES: (SituacaoPedido | "")[] = ["", "PENDENTE", "PARCIAL", "ATENDIDO"];

export function AnaliseFiltros({ value, onChange, onClear, periodoInvalido }: AnaliseFiltrosProps) {
  const set = <K extends keyof AnaliseFiltrosValue>(key: K, v: AnaliseFiltrosValue[K]) =>
    onChange({ ...value, [key]: v });
  const temFiltroExtra = !!value.busca || !!value.situacao || value.rateios.length > 0;
  const rateiosQuery = useAnaliseRateiosQuery();

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-1">
            <span className="block text-xs font-medium text-muted-foreground">Emitido de</span>
            <Input
              type="date"
              value={value.dataInicio}
              max={value.dataFim || undefined}
              onChange={(e) => set("dataInicio", e.target.value)}
              className="h-9 w-40 text-xs"
              error={periodoInvalido ? " " : undefined}
              showErrorMessage={false}
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-muted-foreground">até</span>
            <Input
              type="date"
              value={value.dataFim}
              min={value.dataInicio || undefined}
              onChange={(e) => set("dataFim", e.target.value)}
              className="h-9 w-40 text-xs"
              error={periodoInvalido ? " " : undefined}
              showErrorMessage={false}
            />
          </label>
        </div>

        <label className="flex-1 space-y-1 lg:max-w-md">
          <span className="block text-xs font-medium text-muted-foreground">Buscar</span>
          <Input
            placeholder="Pedido, RC, fornecedor ou item"
            value={value.busca}
            onChange={(e) => set("busca", e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9"
          />
        </label>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-muted-foreground">Situação</span>
          <div role="radiogroup" aria-label="Situação" className="flex h-9 rounded-lg border border-border p-0.5">
            {SITUACOES.map((s) => (
              <button
                key={s || "todas"}
                type="button"
                role="radio"
                aria-checked={value.situacao === s}
                onClick={() => set("situacao", s)}
                className={cn(
                  "cursor-pointer rounded-md px-3 text-xs font-medium transition-colors",
                  value.situacao === s
                    ? "bg-brand-gradient text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {s ? SITUACAO_LABELS[s] : "Todas"}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-1 lg:w-56">
          <span className="block text-xs font-medium text-muted-foreground">Rateios</span>
          <MultiSelect
            aria-label="Filtrar por rateios"
            options={rateioOptions(rateiosQuery.data)}
            value={value.rateios}
            onChange={(rateios) => set("rateios", rateios)}
            isLoading={rateiosQuery.isLoading}
            placeholder="Todos os rateios"
            searchPlaceholder="Buscar rateio"
          />
        </div>

        {temFiltroExtra && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-9 self-start text-muted-foreground lg:self-end">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <RateiosSelecionados value={value.rateios} onChange={(rateios) => set("rateios", rateios)} rateios={rateiosQuery.data} />

      {periodoInvalido && (
        <p className="text-xs font-medium text-danger">A data inicial precisa ser anterior ou igual à final.</p>
      )}
    </div>
  );
}
