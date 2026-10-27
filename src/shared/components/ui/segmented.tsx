import type * as React from "react";
import { cn } from "@/shared/lib/utils";

/** Grupo de botões exclusivos (radio) no visual de abas compactas: período rápido, visão, faixa... */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  stretch = false,
  className,
}: {
  label: string;
  options: { id: T; label: React.ReactNode }[];
  value: T | null;
  onChange: (value: T) => void;
  /** Botões dividem a largura toda do grupo (use com uma largura no className). */
  stretch?: boolean;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex h-9 rounded-lg border border-border bg-card p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
            stretch && "flex-1",
            value === o.id
              ? "bg-brand-gradient text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
