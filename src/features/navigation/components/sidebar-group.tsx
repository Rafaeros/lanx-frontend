import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "@/shared/lib/utils";
import { SECTION_ICONS, SECTION_LABELS } from "../config/sections";
import { matchesPath } from "../lib/resolve";
import type { NavSection } from "../types";
import { SidebarLink } from "./sidebar-link";

export interface SidebarGroupProps {
  section: NavSection;
  defaultOpen?: boolean;
  onNavigate?: () => void;
}

/** Seção recolhível da sidebar (Cadastros, Operações, Relatórios). Abre sozinha se contém a rota atual. */
export function SidebarGroup({ section, defaultOpen = true, onNavigate }: SidebarGroupProps) {
  const { pathname } = useLocation();
  const containsActiveRoute = section.items.some((item) => matchesPath(item, pathname));
  const [open, setOpen] = React.useState(defaultOpen || containsActiveRoute);
  const contentId = React.useId();

  React.useEffect(() => {
    if (containsActiveRoute) setOpen(true);
  }, [containsActiveRoute]);

  const Icon = SECTION_ICONS[section.kind];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{SECTION_LABELS[section.kind]}</span>
        <span className="text-xs font-medium text-muted-foreground">{section.items.length}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            !open && "-rotate-90"
          )}
        />
      </button>

      {open && (
        <div id={contentId} className="mt-0.5 ml-[1.15rem] space-y-0.5 border-l border-border pl-2">
          {section.items.map((item) => (
            <SidebarLink key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}
