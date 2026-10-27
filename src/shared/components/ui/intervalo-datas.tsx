import { Input } from "./input";
import { cn } from "@/shared/lib/utils";

export interface IntervaloDatas {
  dataInicio: string;
  dataFim: string;
}

export interface IntervaloDatasInputProps {
  value: IntervaloDatas;
  onChange: (value: IntervaloDatas) => void;
  /** Destaca os dois campos em vermelho (ex.: início depois do fim). */
  invalido?: boolean;
  labelInicio?: string;
  labelFim?: string;
  className?: string;
}

/**
 * Par de datas "de … até". No celular os dois campos dividem a largura da linha; a partir de `sm`
 * têm largura fixa, para ficarem ao lado de atalhos e botões sem espremer.
 */
export function IntervaloDatasInput({
  value,
  onChange,
  invalido,
  labelInicio = "Período de",
  labelFim = "Período até",
  className,
}: IntervaloDatasInputProps) {
  const erro = invalido ? " " : undefined;
  return (
    <div
      className={cn("grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:flex", className)}
    >
      <div className="min-w-0 sm:w-40">
        <Input
          type="date"
          aria-label={labelInicio}
          value={value.dataInicio}
          max={value.dataFim || undefined}
          onChange={(e) => onChange({ ...value, dataInicio: e.target.value })}
          className="h-9 text-xs"
          error={erro}
          showErrorMessage={false}
        />
      </div>
      <span className="text-xs text-muted-foreground">até</span>
      <div className="min-w-0 sm:w-40">
        <Input
          type="date"
          aria-label={labelFim}
          value={value.dataFim}
          min={value.dataInicio || undefined}
          onChange={(e) => onChange({ ...value, dataFim: e.target.value })}
          className="h-9 text-xs"
          error={erro}
          showErrorMessage={false}
        />
      </div>
    </div>
  );
}
