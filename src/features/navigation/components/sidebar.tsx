import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useModuleNavigation } from "../hooks/use-module-navigation";
import { useOpenModule } from "../hooks/use-open-module";
import { useSidebarCollapsed } from "../hooks/use-sidebar-collapsed";
import { ModuleSwitcher } from "./module-switcher";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarGroup } from "./sidebar-group";
import { ComingSoonNotice } from "./coming-soon-notice";
import { SidebarTooltip } from "./sidebar-tooltip";
import { SidebarUser } from "./sidebar-user";

export interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useCurrentUser();
  const { modules, activeModule, selectModule, cadastros, sections, isLoading } =
    useModuleNavigation();
  const openModule = useOpenModule(selectModule);
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Navegação principal"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-[transform,width] duration-200 ease-out",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed && "lg:w-[4.5rem]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Marca + seletor de módulos (recolhida: empilhados, só ícones) */}
        <div
          className={cn(
            "relative flex shrink-0 border-b border-border",
            collapsed
              ? "flex-col items-center gap-2 py-3"
              : "h-16 items-center justify-between gap-2 px-4"
          )}
        >
          <SidebarBrand module={activeModule} collapsed={collapsed} onNavigate={onMobileClose} />
          <div className="flex items-center gap-1">
            <ModuleSwitcher
              modules={modules}
              activeModuleId={activeModule?.id}
              onSelect={openModule}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-9 w-9 lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Só esta área rola quando o menu cresce; marca e usuário ficam fixos */}
        <nav
          className={cn(
            "flex-1 space-y-4 overflow-y-auto overscroll-contain py-4 [scrollbar-width:thin]",
            collapsed ? "px-2" : "px-3"
          )}
        >
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            <div className="space-y-1">
              {cadastros.items.length > 0 && (
                <SidebarGroup
                  section={cadastros}
                  defaultOpen={false}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              )}
              {sections.map((section) => (
                <SidebarGroup
                  key={section.kind}
                  section={section}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ))}
            </div>
          )}

          {activeModule?.status === "soon" && !collapsed && <ComingSoonNotice module={activeModule} />}
        </nav>

        <div className="shrink-0 border-t border-border">
          <div className={cn("hidden pt-2 lg:block", collapsed ? "px-2" : "px-3")}>
            <SidebarTooltip enabled={collapsed} label="Expandir menu">
              <button
                type="button"
                onClick={toggle}
                aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                aria-pressed={collapsed}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center px-0" : "px-2.5"
                )}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4 shrink-0" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4 shrink-0" />
                    <span>Recolher menu</span>
                  </>
                )}
              </button>
            </SidebarTooltip>
          </div>
          <SidebarUser user={user} collapsed={collapsed} onLogout={logout} />
        </div>
      </aside>
    </>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-1" aria-label="Carregando menu">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-8 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}
