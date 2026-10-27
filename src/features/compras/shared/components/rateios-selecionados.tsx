import { X } from "lucide-react";
import type { RateioFiltro } from "../rateios";

export interface RateiosSelecionadosProps {
  /** Ids selecionados. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Rateios conhecidos, para mostrar o nome de cada id. */
  rateios?: RateioFiltro[];
}

/** Chips removíveis dos rateios filtrados + "Limpar rateios". Não renderiza nada sem seleção. */
export function RateiosSelecionados({ value, onChange, rateios }: RateiosSelecionadosProps) {
  if (value.length === 0) return null;
  const nome = (id: string) => rateios?.find((r) => r.id === id)?.nome ?? "…";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 py-0.5 pl-2.5 pr-1 text-[11px] font-medium text-primary"
        >
          {nome(id)}
          <button
            type="button"
            aria-label={`Remover rateio ${nome(id)}`}
            onClick={() => onChange(value.filter((x) => x !== id))}
            className="cursor-pointer rounded-full p-0.5 hover:bg-primary/20"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange([])}
        className="cursor-pointer px-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
      >
        Limpar rateios
      </button>
    </div>
  );
}
