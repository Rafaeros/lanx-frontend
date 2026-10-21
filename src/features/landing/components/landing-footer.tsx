import { BrandLogo } from "@/shared/components/ui/brand-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-24 pt-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-10 sm:pr-24 2xl:pr-6">
        <div className="space-y-2">
          <BrandLogo size="sm" />
          <p>Sistema de gestão interno da LANX Cables.</p>
        </div>
        <span>© {new Date().getFullYear()} LANX Cables. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}
