import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { UserResponse } from "@/shared/types";

export interface SidebarUserProps {
  user: UserResponse | null;
  onLogout: () => void;
}

export function SidebarUser({ user, onLogout }: SidebarUserProps) {
  const username = user?.username || "Usuário";
  const roleName = user?.roles?.[0]?.name;

  return (
    <div className="flex items-center gap-3 border-t border-border p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {username.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{username}</p>
        <p className="truncate text-xs text-muted-foreground">{roleName ?? "Sessão ativa"}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        title="Sair"
        aria-label="Sair"
        className="h-8 w-8 text-muted-foreground hover:bg-danger/10 hover:text-danger"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
