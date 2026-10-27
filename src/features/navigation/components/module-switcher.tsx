import * as React from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useDismiss } from "../hooks/use-dismiss";
import type { ModuleDefinition } from "../types";
import { ModuleTile } from "./module-tile";

export interface ModuleSwitcherProps {
  modules: ModuleDefinition[];
  activeModuleId?: string;
  onSelect: (module: ModuleDefinition) => void;
}

/**
 * Botão quadrado que abre a grade de módulos. No desktop o painel abre ao lado da sidebar;
 * no celular (drawer) abre logo abaixo do botão.
 */
export function ModuleSwitcher({ modules, activeModuleId, onSelect }: ModuleSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();
  const close = React.useCallback(() => setOpen(false), []);

  useDismiss(containerRef, open, close);

  const handleSelect = (module: ModuleDefinition) => {
    onSelect(module);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="static lg:relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Abrir seletor de módulos"
        title="Módulos"
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors",
          open
            ? "border-primary/40 bg-sidebar-active text-primary"
            : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <LayoutGrid className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Módulos do sistema"
          className={cn(
            "absolute z-50 rounded-2xl border border-border bg-card p-3 shadow-xl animate-fade-in",
            "left-3 right-3 top-[calc(100%+0.5rem)]",
            "lg:left-[calc(100%+1.25rem)] lg:right-auto lg:top-0 lg:w-[26rem]"
          )}
        >
          <div className="px-1 pb-3">
            <p className="text-sm font-semibold text-foreground">Módulos</p>
            <p className="text-xs text-muted-foreground">
              A sidebar mostra as telas do módulo escolhido. Cadastros ficam sempre disponíveis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((module) => (
              <ModuleTile
                key={module.id}
                module={module}
                selected={module.id === activeModuleId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
