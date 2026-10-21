import { Link } from "react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { HERO } from "../content";
import { usePrefersReducedMotion, useScrollY } from "../hooks/use-scroll-y";
import { CableLines } from "./cable-lines";
import { ProductPreview } from "./product-preview";

export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const y = useScrollY();
  const reduced = usePrefersReducedMotion();
  // Parallax só no começo da página: o texto sobe e some, a prévia "deita" na tela
  const p = reduced ? 0 : Math.min(1, y / 600);

  return (
    <section id="topo" className="relative isolate overflow-hidden pt-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-from/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-to/20 blur-3xl"
      />
      <CableLines className="-z-10 opacity-50 [mask-image:linear-gradient(to_bottom,transparent_55%,black_80%)] lg:opacity-80 lg:[mask-image:linear-gradient(to_right,transparent_38%,black_62%)]" />

      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div style={{ transform: `translate3d(0, ${p * 80}px, 0)`, opacity: 1 - p * 0.9 }}>
          <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
            {HERO.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {HERO.title} <span className="text-brand-gradient">{HERO.highlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{HERO.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={isAuthenticated ? "/app" : "/login"}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {isAuthenticated ? "Abrir o sistema" : "Entrar com minha conta"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#empresa">
              <Button variant="outline" size="lg" className="w-full bg-card/70 backdrop-blur sm:w-auto">
                Conhecer a LANX
              </Button>
            </a>
          </div>
        </div>

        <div className="[perspective:1400px]">
          <div
            className="animate-float"
            style={{
              transform: `rotateX(${(1 - p) * 10}deg) rotateY(${(1 - p) * -8}deg) translate3d(0, ${-p * 40}px, 0)`,
              transformStyle: "preserve-3d",
            }}
          >
            <ProductPreview />
          </div>
        </div>
      </div>

      <a
        href="#empresa"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
        style={{ opacity: 1 - p * 3 }}
      >
        Role para conhecer
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
