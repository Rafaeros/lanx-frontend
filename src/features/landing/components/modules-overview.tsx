import { MODULES } from "@/features/navigation/config/modules";
import { ModuleIcon } from "@/features/navigation/components/module-icon";
import { cn } from "@/shared/lib/utils";

/** Lista dos módulos e seu status atual, a partir do registro da navegação. */
export function ModulesOverview() {
  const modules = MODULES.filter((m) => m.id !== "administracao");

  return (
    <section id="modulos" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Módulos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Cada área da empresa tem seu módulo, com telas separadas em cadastros, operações e
            relatórios. Os cadastros são compartilhados entre todos.
          </p>
        </div>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {modules.map((module) => {
            const available = module.status === "available";
            return (
              <li key={module.id} className="flex items-center gap-4 py-5">
                <ModuleIcon module={module} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{module.label}</p>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                    available
                      ? "bg-success/10 text-success"
                      : "border border-border text-muted-foreground"
                  )}
                >
                  {available ? "Disponível" : "Em breve"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
