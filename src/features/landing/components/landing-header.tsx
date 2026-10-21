import { Link } from "react-router";
import { BrandLogo } from "@/shared/components/ui/brand-logo";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { cn } from "@/shared/lib/utils";
import { useScrollY } from "../hooks/use-scroll-y";

const LINKS = [
  { href: "#empresa", label: "Empresa" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#modulos", label: "Módulos" },
];

export function LandingHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
  const y = useScrollY();
  const scrolled = y > 8;
  const max = typeof document === "undefined" ? 1 : document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, y / max) : 0;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled ? "border-b border-border bg-background/80 shadow-sm backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#topo" aria-label="Voltar ao topo">
          <BrandLogo />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to={isAuthenticated ? "/app" : "/login"}>
            <Button variant="primary" size="sm">
              {isAuthenticated ? "Abrir o sistema" : "Entrar"}
            </Button>
          </Link>
        </div>
      </div>
      {/* Progresso de leitura da página */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-gradient"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
