import { ChartColumn, ChevronDown, FolderOpen, LayoutGrid, Package, Ruler } from "lucide-react";
import { MODULES } from "@/features/navigation/config/modules";
import { ModuleIcon } from "@/features/navigation/components/module-icon";
import { cn } from "@/shared/lib/utils";

/**
 * Miniatura ilustrativa do sistema: sidebar com o seletor de módulos aberto.
 * Decorativa (aria-hidden); os módulos vêm do mesmo registro usado pela sidebar real.
 */
export function ProductPreview() {
  const modules = MODULES.filter((m) => m.id !== "administracao");

  return (
    <div aria-hidden="true" className="relative select-none">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(118,9,232,0.35)]">
        <div className="flex h-9 items-center gap-1.5 border-b border-border bg-muted/60 px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>

        <div className="grid grid-cols-[11rem_1fr] text-[11px]">
          {/* mini sidebar */}
          <div className="space-y-2 border-r border-border bg-sidebar p-3">
            <div className="flex items-center justify-between">
              <span className="leading-none">
                <span className="block font-display text-sm font-bold text-foreground">LANX</span>
                <span className="text-[10px] font-semibold text-[var(--module-compras)]">Compras</span>
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-primary/40 bg-sidebar-active text-primary">
                <LayoutGrid className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 font-semibold text-foreground">
              <FolderOpen className="h-3 w-3 text-muted-foreground" />
              <span className="flex-1">Cadastros</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="ml-2 space-y-1 border-l border-border pl-2 text-muted-foreground">
              <div className="flex items-center gap-1.5"><Package className="h-3 w-3" />Materiais</div>
              <div className="flex items-center gap-1.5"><Ruler className="h-3 w-3" />Unidades</div>
            </div>
            <div className="px-1.5 pt-1 font-semibold text-foreground">Relatórios</div>
            <div className="flex items-center gap-1.5 rounded-md bg-sidebar-active px-1.5 py-1 font-semibold text-primary">
              <ChartColumn className="h-3 w-3" />
              Análise de pedidos
            </div>
          </div>

          {/* painel de módulos aberto */}
          <div className="bg-background/60 p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">Módulos</p>
            <div className="grid grid-cols-2 gap-1.5">
              {modules.map((module) => {
                const soon = module.status === "soon";
                return (
                  <div
                    key={module.id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-2",
                      soon ? "border-border bg-card" : "border-primary/40 bg-sidebar-active"
                    )}
                  >
                    <ModuleIcon module={module} size="xs" />
                    <span className="min-w-0">
                      <span className={cn("block truncate font-semibold", soon ? "text-muted-foreground" : "text-foreground")}>
                        {module.label}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {soon ? "Em breve" : "Disponível"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
