import * as React from "react";
import { Outlet, NavLink, useLocation, useNavigate, Link } from "react-router";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { Button } from "@/shared/components/ui/button";
import {
  Menu,
  X,
  Layers,
  FileSpreadsheet,
  Package,
  Ruler,
  Users,
  Shield,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Building2,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NavigationNode } from "@/shared/types";

// Mapeamento de rotas e ícones por chave de permissão/feature do backend
const FEATURE_MAP: Record<
  string,
  { to: string; icon: React.ComponentType<{ className?: string }> }
> = {
  cadastros: { to: "/cadastros/materiais", icon: Layers },
  "cadastros.materiais": { to: "/cadastros/materiais", icon: Package },
  "cadastros.unidade-medida": { to: "/cadastros/materiais", icon: Ruler },
  compras: { to: "/compras/analise-pedidos", icon: Building2 },
  "compras.analise-pedidos": { to: "/compras/analise-pedidos", icon: FileSpreadsheet },
  administracao: { to: "#", icon: Shield },
  "administracao.usuarios": { to: "#", icon: Users },
  "administracao.permissoes": { to: "#", icon: Shield },
};

export default function AppLayout() {
  const { user, navigation, isAuthenticated, logout, isLoading } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isAuthenticated && isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-purple)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--card-border)] bg-[var(--card-bg)] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[var(--card-border)]">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[var(--brand-purple)] to-[var(--brand-blue)] flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-blue)] bg-clip-text text-transparent leading-none">
                LANX
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)] tracking-wider uppercase font-semibold">
                Enterprise
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Dynamic Navigation generated from backend permissions tree */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div className="space-y-1">
            <span className="px-2 text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
              Módulos do Sistema
            </span>

            <nav className="mt-2 space-y-1">
              {navigation.length === 0 ? (
                <div className="px-2 py-4 text-xs text-[var(--muted-foreground)]">
                  Nenhum módulo autorizado.
                </div>
              ) : (
                navigation.map((groupNode: NavigationNode) => {
                  const isCollapsed = collapsedGroups[groupNode.key];
                  const GroupIcon = FEATURE_MAP[groupNode.key]?.icon || FolderOpen;

                  return (
                    <div key={groupNode.key} className="space-y-1 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupNode.key)}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon className="h-4 w-4" />
                          <span>{groupNode.label}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            isCollapsed && "-rotate-90"
                          )}
                        />
                      </button>

                      {!isCollapsed && groupNode.children && (
                        <div className="space-y-1 pl-4 pt-1">
                          {groupNode.children.map((childNode) => {
                            const mapping = FEATURE_MAP[childNode.key];
                            const to = mapping?.to || "#";
                            const Icon = mapping?.icon || Package;
                            const isActive = location.pathname.startsWith(to) && to !== "#";

                            return (
                              <NavLink
                                key={childNode.key}
                                to={to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                  isActive
                                    ? "bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] font-semibold border-l-2 border-[var(--brand-purple)]"
                                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                )}
                              >
                                <Icon className={cn("h-4 w-4", isActive && "text-[var(--brand-purple)]")} />
                                <span>{childNode.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </nav>
          </div>
        </div>

        {/* User Profile Card & Logout */}
        <div className="border-t border-[var(--card-border)] p-4 bg-[var(--muted)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-[var(--brand-purple)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {user?.username || "Usuário"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">
                  {user?.roles?.[0]?.name || "Colaborador"}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Encerrar sessão"
              className="text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span>LANX</span>
              <span>/</span>
              <span className="text-[var(--foreground)] font-medium capitalize">
                {location.pathname.replace(/^\//, "").replace(/\//g, " / ") || "Início"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="h-6 w-px bg-[var(--card-border)]" />

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[var(--muted-foreground)] hidden md:inline font-medium">
                Conectado ao Backend
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="w-full max-w-[1920px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

