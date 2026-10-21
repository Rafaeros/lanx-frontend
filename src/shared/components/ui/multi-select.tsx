import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn, normalizeSearch as normalize } from "@/shared/lib/utils";

export interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Texto do gatilho quando nada está selecionado (nada selecionado = todos). */
  placeholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  className?: string;
  "aria-label"?: string;
}


/** Seleção múltipla com busca, em popover. Usado nos filtros dos relatórios. */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Todos",
  searchPlaceholder = "Buscar...",
  isLoading,
  className,
  "aria-label": ariaLabel,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();
  const selected = new Set(value);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = normalize(query.trim());
    return q ? options.filter((o) => normalize(o).includes(q)) : options;
  }, [options, query]);

  const toggle = (option: string) =>
    onChange(selected.has(option) ? value.filter((v) => v !== option) : [...value, option]);

  const label =
    value.length === 0 ? placeholder : value.length === 1 ? value[0] : `${value[0]} +${value.length - 1}`;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 text-left text-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open ? "border-primary" : "border-border hover:bg-muted/60"
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", value.length === 0 && "text-muted-foreground")}>{label}</span>
        {value.length > 0 && (
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
            {value.length}
          </span>
        )}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-1.5 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-2 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <ul id={listId} role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto p-1">
            {isLoading && <li className="px-3 py-2 text-xs text-muted-foreground">Carregando...</li>}
            {!isLoading && filtered.length === 0 && (
              <li className="px-3 py-2 text-xs text-muted-foreground">Nada encontrado.</li>
            )}
            {filtered.map((option) => {
              const checked = selected.has(option);
              return (
                <li key={option} role="option" aria-selected={checked}>
                  <button
                    type="button"
                    onClick={() => toggle(option)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        checked ? "border-primary bg-brand-gradient text-primary-foreground" : "border-border bg-card"
                      )}
                    >
                      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/40 px-2 py-1.5">
            <button
              type="button"
              onClick={() => onChange(Array.from(new Set([...value, ...filtered])))}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
            >
              Selecionar {query ? "encontrados" : "todos"}
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              disabled={value.length === 0}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
