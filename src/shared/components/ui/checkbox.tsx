import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  /** Texto de apoio abaixo do rótulo. */
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Caixa de seleção com rótulo clicável e descrição opcional (input nativo, acessível pelo teclado). */
export function Checkbox({ checked, onChange, label, description, disabled, className }: CheckboxProps) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60", className)}
    >
      <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-card transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
        />
        <Check className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}
