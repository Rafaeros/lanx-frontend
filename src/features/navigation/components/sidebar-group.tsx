import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "@/shared/lib/utils";
import { SECTION_ICONS, SECTION_LABELS } from "../config/sections";
import { matchesPath } from "../lib/resolve";
import type { NavSection } from "../types";
import { SidebarLink } from "./sidebar-link";
import { SidebarTooltip } from "./sidebar-tooltip";

export interface SidebarGroupProps {
  section: NavSection;
  defaultOpen?: boolean;
  /** Sidebar recolhida: o cabeçalho vira só o ícone da seção e os itens só ícones. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** Seção recolhível da sidebar (Cadastros, Operações, Relatórios). Abre sozinha se contém a rota atual. */
export function SidebarGroup({ section, defaultOpen = true, collapsed = false, onNavigate }: SidebarGroupProps) {
  const { pathname } = useLocation();
  const containsActiveRoute = section.items.some((item) => matchesPath(item, pathname));
  const [open, setOpen] = React.useState(defaultOpen || containsActiveRoute);
  const contentId = React.useId();

  React.useEffect(() => {
    if (containsActiveRoute) setOpen(true);
  }, [containsActiveRoute]);

  const Icon = SECTION_ICONS[section.kind];
  const label = SECTION_LABELS[section.kind];

  return (
    <div>
      <SidebarTooltip
        enabled={collapsed}
        label={`${label} (${section.items.length}) · ${open ? "recolher" : "expandir"}`}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={contentId}
          aria-label={collapsed ? label : undefined}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 rounded-lg py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
            collapsed ? "justify-center px-0" : "px-2.5",
            collapsed && open && "bg-muted/60"
          )}
        >
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{label}</span>
              <span className="text-xs font-medium text-muted-foreground">{section.items.length}</span>
            </>
          )}
          <ChevronDown
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200",
              collapsed ? "-ml-1 h-3 w-3" : "h-4 w-4",
              !open && "-rotate-90"
            )}
          />
        </button>
      </SidebarTooltip>

      {open && (
        <div
          id={contentId}
          className={cn(
            "mt-0.5 space-y-0.5",
            collapsed ? "mb-1 border-b border-border pb-1" : "ml-[1.15rem] border-l border-border pl-2"
          )}
        >
          {section.items.map((item) => (
            <SidebarLink key={item.id} item={item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}
