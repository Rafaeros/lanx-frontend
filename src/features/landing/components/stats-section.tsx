import * as React from "react";
import { MODULES } from "@/features/navigation/config/modules";
import { useReveal } from "../hooks/use-reveal";
import { usePrefersReducedMotion } from "../hooks/use-scroll-y";

/** Números tirados do próprio sistema (registro de módulos e metas do IQF), não de marketing. */
const STATS = [
  { value: MODULES.length, suffix: "", label: "módulos planejados" },
  { value: MODULES.filter((m) => m.status === "available").length, suffix: "", label: "já em uso" },
  { value: 97, suffix: "%", label: "meta mensal de entregas no prazo" },
  { value: 85, suffix: "%", label: "meta de prazo por fornecedor" },
];

export function StatsSection() {
  const { ref, visible } = useReveal<HTMLDListElement>();
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/60">
      <dl ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-16 sm:px-6 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <dd className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
              <span className="text-brand-gradient">
                <CountUp to={stat.value} start={visible} />
                {stat.suffix}
              </span>
            </dd>
            <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CountUp({ to, start }: { to: number; start: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const duration = 1200;
    const begin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, to, reduced]);

  return <>{value}</>;
}
