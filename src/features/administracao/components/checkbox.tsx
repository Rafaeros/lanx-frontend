import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps {
  checked: boolean | "mixed";
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Checkbox acessível com estado intermediário (usado nas matrizes de permissão). */
export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(checked !== true)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
        )}
      >
        {checked === true && <Check className="h-3 w-3" strokeWidth={3} />}
        {checked === "mixed" && <Minus className="h-3 w-3" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}
