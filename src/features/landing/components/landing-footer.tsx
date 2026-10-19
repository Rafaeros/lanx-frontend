import { BrandLogo } from "@/shared/components/ui/brand-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <BrandLogo size="sm" />
        <span>© {new Date().getFullYear()} LANX. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}
