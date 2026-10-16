import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import { moduleAccentVar } from "../config/modules";
import type { ModuleDefinition } from "../types";
import { ModuleIcon } from "./module-icon";
import { SoonBadge } from "./soon-badge";

export interface ModuleTileProps {
  module: ModuleDefinition;
  selected?: boolean;
  size?: "compact" | "large";
  onSelect: (module: ModuleDefinition) => void;
}

/** Botão de um módulo: usado no seletor da sidebar (compact) e na tela inicial (large). */
export function ModuleTile({ module, selected, size = "compact", onSelect }: ModuleTileProps) {
  const isSoon = module.status === "soon";
  const isLarge = size === "large";

  return (
    <button
      type="button"
      onClick={() => onSelect(module)}
      aria-pressed={selected}
      style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
      className={cn(
        "group relative flex w-full cursor-pointer rounded-xl border text-left transition-colors",
        isLarge ? "items-start gap-4 p-4" : "flex-col items-start gap-2 p-3",
        selected ? "accent-surface" : "border-border bg-card hover:bg-muted"
      )}
    >
      {isSoon && !isLarge && <SoonBadge className="absolute right-2 top-2" />}
      <ModuleIcon module={module} size={isLarge ? "lg" : "md"} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate font-semibold",
              isLarge ? "text-base" : "text-sm",
              isSoon ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {module.label}
          </span>
          {isSoon && isLarge && <SoonBadge />}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-muted-foreground",
            isLarge ? "text-sm" : "text-[11px] leading-snug"
          )}
        >
          {module.description}
        </span>
      </span>
    </button>
  );
}
