import { NavLink } from "react-router";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "../types";
import { SoonBadge } from "./soon-badge";

export interface SidebarLinkProps {
  item: NavItem;
  onNavigate?: () => void;
}

const baseClass = "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors";

export function SidebarLink({ item, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;

  if (item.status === "soon") {
    return (
      <div
        aria-disabled="true"
        title={`${item.label} ainda está por vir`}
        className={cn(baseClass, "cursor-not-allowed text-muted-foreground/70")}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        <SoonBadge />
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          baseClass,
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
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}
