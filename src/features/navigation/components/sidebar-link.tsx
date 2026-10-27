import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "../types";
import { SidebarTooltip } from "./sidebar-tooltip";
import { SoonBadge } from "./soon-badge";

export interface SidebarLinkProps {
  item: NavItem;
  /** Sidebar recolhida: só o ícone, com o nome no tooltip. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

const baseClass = "flex items-center gap-2.5 rounded-lg py-2 text-sm transition-colors";

export function SidebarLink({ item, collapsed = false, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;
  const layout = collapsed ? "justify-center px-0" : "px-2.5";

  if (item.status === "soon") {
    return (
      <SidebarTooltip enabled={collapsed} label={`${item.label} · em breve`}>
        <div
          aria-disabled="true"
          aria-label={collapsed ? item.label : undefined}
          title={collapsed ? undefined : `${item.label} ainda está por vir`}
          className={cn(baseClass, layout, "cursor-not-allowed text-muted-foreground/70")}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              <SoonBadge />
            </>
          )}
        </div>
      </SidebarTooltip>
    );
  }

  return (
    <SidebarTooltip enabled={collapsed} label={item.label}>
      <NavLink
        to={item.to}
        onClick={onNavigate}
        aria-label={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            baseClass,
            layout,
            "relative",
            isActive
              ? "bg-sidebar-active font-semibold text-primary"
              : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand-gradient" />
            )}
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </>
        )}
      </NavLink>
    </SidebarTooltip>
  );
}
