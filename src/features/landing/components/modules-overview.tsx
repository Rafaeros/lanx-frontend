import type * as React from "react";
import { MODULES, moduleAccentVar } from "@/features/navigation/config/modules";
import { ModuleIcon } from "@/features/navigation/components/module-icon";
import { cn } from "@/shared/lib/utils";
import { Reveal } from "./reveal";

/** Módulos e status atual, a partir do mesmo registro usado pela navegação do sistema. */
export function ModulesOverview() {
  return (
    <section id="modulos" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Módulos</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Cada área com o seu espaço
          </h2>
          <p className="mt-4 text-muted-foreground">
            As telas de cada área ficam separadas em cadastros, operações e relatórios. Materiais,
            fornecedores e operadores são cadastrados uma vez e usados por todos os módulos.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module, i) => {
            const available = module.status === "available";
            const telas = module.sections.flatMap((s) => s.items);
            return (
              <Reveal
                as="li"
                key={module.id}
                delay={(i % 3) * 110}
                from="scale"
                  style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-[border-color,box-shadow] duration-300",
                    available
                      ? "border-border hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] hover:shadow-lg"
                      : "border-dashed border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <ModuleIcon module={module} size="lg" />
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        available ? "bg-success/10 text-success" : "border border-border text-muted-foreground"
                      )}
                    >
                      {available ? "Disponível" : "Em breve"}
                    </span>
                  </div>
                  <p className="mt-5 font-display text-lg font-semibold text-foreground">{module.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                  {telas.length > 0 && (
                    <p className="mt-4 text-xs font-medium text-muted-foreground">
                      {telas.map((t) => t.label).join(" · ")}
                    </p>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-x-100"
                  />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
