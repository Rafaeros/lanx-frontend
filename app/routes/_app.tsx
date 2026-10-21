import * as React from "react";
import { Outlet, useLocation } from "react-router";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";
import { AppHeader, ModuleNavigationProvider, Sidebar } from "@/features/navigation";

export default function AppLayout() {
  const { isAuthenticated } = useRequireAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => setMobileMenuOpen(false), [pathname]);

  if (!isAuthenticated) return null;

  return (
    <ModuleNavigationProvider>
      {/* Desktop: altura fixa na viewport e só o <main> rola (telas de listagem cabem inteiras).
          Mobile: a página rola normalmente. */}
      <div className="flex min-h-dvh bg-background text-foreground lg:h-dvh lg:overflow-hidden">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
          <AppHeader onOpenMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-6">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ModuleNavigationProvider>
  );
}
