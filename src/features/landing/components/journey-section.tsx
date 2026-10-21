import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { JOURNEY, type JourneyStep } from "../content";
import { Reveal } from "./reveal";

/**
 * "Como funciona": no desktop, o painel da direita fica fixo (sticky) e troca de etapa
 * conforme o texto da esquerda passa pelo meio da tela. No mobile, cada etapa traz o seu painel.
 */
export function JourneySection() {
  const [active, setActive] = React.useState(0);
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Como funciona</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Uma linha só, da compra à produção
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cada etapa usa o que a anterior registrou. Role para seguir o caminho.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-4 lg:grid-cols-2 lg:gap-16">
          <div>
            {JOURNEY.map((step, i) => (
              <div
                key={step.kicker}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-index={i}
                className="py-6 lg:flex lg:min-h-[60vh] lg:items-center lg:py-0"
              >
                <Reveal>
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      active === i ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.kicker}
                  </p>
                  <h3
                    className={cn(
                      "mt-2 font-display text-2xl font-semibold tracking-tight transition-colors duration-300 sm:text-3xl",
                      active === i ? "text-foreground" : "text-foreground lg:text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{step.text}</p>
                  <div className="mt-6 lg:hidden">
                    <StepPanel step={step} index={i} />
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-11rem)]">
              <StepPanel key={active} step={JOURNEY[active]} index={active} />
              <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
                {JOURNEY.map((step, i) => (
                  <span
                    key={step.kicker}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-8 bg-brand-gradient" : "w-1.5 bg-border"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepPanel({ step, index }: { step: JourneyStep; index: number }) {
  const Icon = step.icon;
  return (
    <div className="animate-fade-in relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--brand-from)_55%,transparent)] sm:p-8">
      <div aria-hidden="true" className="absolute inset-0 bg-brand-gradient-soft" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-primary/30">
            <Icon className="h-7 w-7" />
          </span>
          <span className="font-display text-5xl font-semibold text-foreground/10 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-6 font-display text-lg font-semibold text-foreground">{step.title}</p>
        <ul className="mt-4 space-y-2.5">
          {step.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm text-foreground backdrop-blur"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3 w-3" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
