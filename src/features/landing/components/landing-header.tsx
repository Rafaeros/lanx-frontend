import { Link } from "react-router";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export function LandingHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <a
            href="#modulos"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Módulos
          </a>
          <ThemeToggle />
          <Link to={isAuthenticated ? "/app" : "/login"}>
            <Button variant="primary" size="sm">
              {isAuthenticated ? "Abrir o sistema" : "Entrar"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
