import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useModuleNavigation } from "../hooks/use-module-navigation";
import { useOpenModule } from "../hooks/use-open-module";
import { ModuleSwitcher } from "./module-switcher";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarGroup } from "./sidebar-group";
import { ComingSoonNotice } from "./coming-soon-notice";
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-out",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Marca + seletor de módulos */}
        <div className="relative flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <SidebarBrand module={activeModule} onNavigate={onMobileClose} />
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

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            <div className="space-y-1">
              {cadastros.items.length > 0 && (
                <SidebarGroup section={cadastros} defaultOpen={false} onNavigate={onMobileClose} />
              )}
              {sections.map((section) => (
                <SidebarGroup key={section.kind} section={section} onNavigate={onMobileClose} />
              ))}
            </div>
          )}

          {activeModule?.status === "soon" && <ComingSoonNotice module={activeModule} />}
        </nav>

        <SidebarUser user={user} onLogout={logout} />
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
