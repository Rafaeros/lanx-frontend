import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { UserResponse } from "@/shared/types";
import { SidebarTooltip } from "./sidebar-tooltip";

export interface SidebarUserProps {
  user: UserResponse | null;
  collapsed?: boolean;
  onLogout: () => void;
}

export function SidebarUser({ user, collapsed = false, onLogout }: SidebarUserProps) {
  const username = user?.username || "Usuário";
  const roleName = user?.roles?.[0]?.name;

  return (
    <div className={cn("flex items-center gap-3 p-3", collapsed && "flex-col gap-2 px-0")}>
      <SidebarTooltip enabled={collapsed} label={`${username} · ${roleName ?? "Sessão ativa"}`}>
        <div
          tabIndex={collapsed ? 0 : undefined}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white"
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </SidebarTooltip>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{username}</p>
          <p className="truncate text-xs text-muted-foreground">{roleName ?? "Sessão ativa"}</p>
        </div>
      )}
      <SidebarTooltip enabled={collapsed} label="Sair">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          title={collapsed ? undefined : "Sair"}
          aria-label="Sair"
          className="h-8 w-8 text-muted-foreground hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </SidebarTooltip>
    </div>
  );
}
