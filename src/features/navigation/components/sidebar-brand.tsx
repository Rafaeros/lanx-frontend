import type * as React from "react";
import { Link } from "react-router";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
import { moduleAccentVar } from "../config/modules";
import type { ModuleDefinition } from "../types";

/** Marca LANX com o nome do módulo ativo logo abaixo, na cor do módulo. */
export function SidebarBrand({
  module,
  onNavigate,
}: {
  module?: ModuleDefinition;
  onNavigate?: () => void;
}) {
  return (
    <Link to="/app" onClick={onNavigate} aria-label="Ir para o início" className="min-w-0">
      <BrandLogo
        size="sm"
        caption={
          module && (
            <span
              style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
              className="accent-text font-semibold"
            >
              {module.label}
            </span>
          )
        }
      />
    </Link>
  );
}
