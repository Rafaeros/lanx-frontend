import type * as React from "react";
import { Link } from "react-router";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
import { moduleAccentVar } from "../config/modules";
import type { ModuleDefinition } from "../types";
import { ModuleIcon } from "./module-icon";
import { SidebarTooltip } from "./sidebar-tooltip";

/**
 * Marca LANX com o módulo ativo (ícone + nome) logo abaixo, na cor do módulo.
 * Recolhida, a sidebar mostra só o ícone do módulo.
 */
export function SidebarBrand({
  module,
  collapsed = false,
  onNavigate,
}: {
  module?: ModuleDefinition;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  if (collapsed) {
    return (
      <SidebarTooltip enabled label={module ? `LANX · ${module.label}` : "LANX"}>
        <Link to="/app" onClick={onNavigate} aria-label="Ir para o início" className="block">
          {module ? (
            <ModuleIcon module={module} size="md" />
          ) : (
            <img src="/brand/icon-192.png" alt="" className="h-9 w-9" draggable={false} />
          )}
        </Link>
      </SidebarTooltip>
    );
  }

  const ModuleGlyph = module?.icon;

  return (
    <Link to="/app" onClick={onNavigate} aria-label="Ir para o início" className="min-w-0">
      <BrandLogo
        size="sm"
        caption={
          module &&
          ModuleGlyph && (
            <span
              style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
              className="accent-text flex items-center gap-1 font-semibold"
            >
              <ModuleGlyph className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {module.label}
            </span>
          )
        }
      />
    </Link>
  );
}
