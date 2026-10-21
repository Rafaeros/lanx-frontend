import { ABOUT } from "../content";
import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <section id="empresa" className="scroll-mt-16 border-t border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold text-primary">A empresa</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {ABOUT.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{ABOUT.description}</p>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
            {ABOUT.pillars.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 120}
                from="right"
                className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/30"
              >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm shadow-primary/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-foreground">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{text}</span>
                  </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
