import { Minus, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { TOLERANCIA_MAXIMA } from "../lib/classificacao";

export interface ToleranciaInputProps {
  value: number;
  onChange: (dias: number) => void;
  labelledBy?: string;
}

const limitar = (n: number) => Math.min(TOLERANCIA_MAXIMA, Math.max(0, Math.round(n)));

/** Dias de atraso tolerados após a previsão (0 a 30): botões −/+ e campo numérico. */
export function ToleranciaInput({ value, onChange, labelledBy }: ToleranciaInputProps) {
  const botao =
    "flex h-full w-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex h-9 w-40 items-stretch overflow-hidden rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-ring">
      <button
        type="button"
        aria-label="Diminuir tolerância"
        onClick={() => onChange(limitar(value - 1))}
        disabled={value <= 0}
        className={cn(botao, "border-r border-border")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <label className="flex flex-1 items-center justify-center gap-1 text-xs">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={TOLERANCIA_MAXIMA}
          value={value}
          aria-labelledby={labelledBy}
          onChange={(e) => onChange(limitar(Number(e.target.value) || 0))}
          className="w-8 bg-transparent text-right font-semibold tabular-nums text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-muted-foreground">{value === 1 ? "dia" : "dias"}</span>
      </label>
      <button
        type="button"
        aria-label="Aumentar tolerância"
        onClick={() => onChange(limitar(value + 1))}
        disabled={value >= TOLERANCIA_MAXIMA}
        className={cn(botao, "border-l border-border")}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
