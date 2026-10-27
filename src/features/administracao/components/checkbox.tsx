import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps {
  checked: boolean | "mixed";
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  /** Nome acessível quando o rótulo visível não basta (ex.: célula de matriz sem texto). */
  "aria-label"?: string;
  /** "pill": chip com borda, usado para ações específicas (Importar, Exportar…). */
  variant?: "default" | "pill";
  /** Ícone opcional exibido antes do rótulo (variante pill). */
  icon?: React.ReactNode;
}

/** Checkbox acessível com estado intermediário (usado nas matrizes de permissão). */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className,
  "aria-label": ariaLabel,
  variant = "default",
  icon,
}: CheckboxProps) {
  const isOn = checked !== false;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(checked !== true)}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 text-sm text-foreground",
        "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "pill" && [
          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          isOn
            ? "border-primary bg-primary/10 text-primary"
            : "border-dashed border-muted-foreground/50 text-muted-foreground enabled:hover:border-primary enabled:hover:text-foreground",
        ],
        className
      )}
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors",
          isOn
            ? "border-primary bg-brand-gradient text-primary-foreground"
            : // a borda padrão (--card-border) some no fundo branco: usa o cinza do texto secundário
              "border-muted-foreground/60 bg-card group-enabled:group-hover:border-primary"
        )}
      >
        {checked === true && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        {checked === "mixed" && <Minus className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      {icon}
      {label}
    </button>
  );
}
