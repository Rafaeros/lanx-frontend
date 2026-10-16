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
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader onOpenMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ModuleNavigationProvider>
  );
}
