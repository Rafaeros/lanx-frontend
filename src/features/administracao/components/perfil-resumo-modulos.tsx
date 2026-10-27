import { ListChecks } from "lucide-react";
import type { FeatureNode } from "../types";
import { cn } from "@/shared/lib/utils";
import { collectCodes } from "../lib/permissions";
import { moduloAncora } from "./permission-matrix";

/**
 * Quantas permissões estão marcadas em cada módulo. Cada linha leva ao módulo na matriz, para não
 * precisar rolar a lista inteira atrás dele.
 */
export function PerfilResumoModulos({ features, value }: { features: FeatureNode[]; value: string[] }) {
  const selected = new Set(value);
  const modulos = features.map((module) => {
    const codes = collectCodes(module);
    return { module, total: codes.length, marcadas: codes.filter((c) => selected.has(c)).length };
  });
  const total = modulos.reduce((s, m) => s + m.total, 0);
  const marcadas = modulos.reduce((s, m) => s + m.marcadas, 0);

  const irPara = (key: string) =>
    document.getElementById(moduloAncora(key))?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
        <ListChecks className="h-4 w-4 text-primary" />
        Resumo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="font-semibold tabular-nums text-foreground">{marcadas}</span> de{" "}
        <span className="tabular-nums">{total}</span> permissões marcadas
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width]"
          style={{ width: `${total ? (marcadas / total) * 100 : 0}%` }}
        />
      </div>

      <nav aria-label="Ir para o módulo" className="mt-4">
        <ul className="space-y-0.5">
          {modulos.map(({ module, total: t, marcadas: m }) => (
            <li key={module.key}>
              <button
                type="button"
                onClick={() => irPara(module.key)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="truncate">{module.label}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                    m === t && t > 0
                      ? "bg-success/15 text-success"
                      : m > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {m}/{t}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
