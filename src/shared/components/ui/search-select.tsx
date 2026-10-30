import * as React from "react";
import { Check, ChevronDown, Loader2, Plus, Search, X } from "lucide-react";
import { cn, normalizeSearch } from "@/shared/lib/utils";

export interface SearchSelectOption {
  value: string;
  label: string;
  /** Texto secundário abaixo do rótulo (também entra na busca). */
  description?: string;
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  /** "" = nada selecionado. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
  /** Mostra o X para limpar a seleção (volta para ""). */
  clearable?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  /** Cadastro rápido: mostra "Cadastrar …" no rodapé da lista e recebe o texto buscado. */
  onCreate?: (termo: string) => void;
  /** Rótulo do cadastro quando não há busca (ex.: "Novo departamento"). */
  createLabel?: string;
}

/** Altura máxima da lista; abaixo disso de espaço livre, o popover abre para cima. */
const POPOVER_SPACE = 320;

/**
 * Select de uma opção com busca (combobox ARIA). Teclado: setas, Home/End, Enter seleciona,
 * Esc fecha sem fechar o modal em volta. A busca ignora acentos e maiúsculas. Com `onCreate`, o
 * rodapé oferece o cadastro rápido do que foi buscado (Enter também, quando nada foi encontrado).
 */
export const SearchSelect = React.forwardRef<HTMLButtonElement, SearchSelectProps>(function SearchSelect(
  {
    options,
    value,
    onChange,
    onBlur,
    placeholder = "Selecione",
    searchPlaceholder = "Buscar...",
    emptyMessage = "Nada encontrado.",
    isLoading,
    disabled,
    clearable,
    invalid,
    id,
    name,
    className,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    onCreate,
    createLabel = "Cadastrar novo",
  },
  ref
) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [openUp, setOpenUp] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();
  const optionId = (index: number) => `${listId}-opt-${index}`;

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  const selected = options.find((o) => o.value === value);

  const filtered = React.useMemo(() => {
    const q = normalizeSearch(query.trim());
    if (!q) return options;
    return options.filter((o) => normalizeSearch(`${o.label} ${o.description ?? ""}`).includes(q));
  }, [options, query]);

  const close = React.useCallback((focusTrigger = false) => {
    setOpen(false);
    setQuery("");
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const openPopover = () => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    setOpenUp(!!rect && window.innerHeight - rect.bottom < POPOVER_SPACE && rect.top > POPOVER_SPACE);
    // Abre com a opção atual em destaque
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  // Clique fora fecha (o Esc é tratado no teclado para não fechar um modal em volta)
  React.useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        close();
        onBlur?.();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close, onBlur]);

  // Mantém a opção ativa visível ao navegar com as setas
  React.useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const select = (option: SearchSelectOption) => {
    onChange(option.value);
    close(true);
  };

  const criar = () => {
    const termo = query.trim();
    close();
    onCreate?.(termo);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const last = filtered.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[active]) select(filtered[active]);
        // nada na lista: Enter cadastra o que foi digitado
        else if (onCreate && query.trim()) criar();
        break;
      case "Escape":
        // Não deixa o Esc chegar ao Dialog: fecha só o select
        e.preventDefault();
        e.stopPropagation();
        close(true);
        break;
      case "Tab":
        close();
        break;
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openPopover();
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? close() : openPopover())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 text-left text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-danger focus-visible:ring-danger" : open ? "border-primary" : "border-border hover:bg-muted/60"
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
        {/* Espaço do botão de limpar, que fica por cima do gatilho */}
        {clearable && selected && !disabled && <span aria-hidden="true" className="w-6 shrink-0" />}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Fora do botão para não aninhar elementos interativos */}
      {clearable && selected && !disabled && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            triggerRef.current?.focus();
          }}
          aria-label="Limpar seleção"
          title="Limpar seleção"
          className="absolute right-8 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {open && (
        <div
          className={cn(
            "animate-fade-in absolute inset-x-0 z-50 min-w-[14rem] overflow-hidden rounded-xl border border-border bg-card shadow-xl",
            openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={filtered[active] ? optionId(active) : undefined}
                aria-label={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto overscroll-contain p-1">
            {isLoading ? (
              <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-muted-foreground">{emptyMessage}</li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onPointerMove={() => setActive(index)}
                    // pointerdown antes do blur do input: seleciona sem perder o clique
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => select(option)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground",
                      index === active && "bg-muted"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate", isSelected && "font-semibold text-primary")}>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="block truncate text-xs text-muted-foreground">{option.description}</span>
                      )}
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </li>
                );
              })
            )}
          </ul>

          {onCreate && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                // pointerdown antes do blur do input: o clique não se perde
                onPointerDown={(e) => e.preventDefault()}
                onClick={criar}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">
                  {query.trim() ? <>Cadastrar “{query.trim()}”</> : createLabel}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
