import * as React from "react";
import { Download, Search, Upload, X, Zap } from "lucide-react";
import type { FeatureNode } from "../types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import {
  CRUD_ACTIONS,
  actionLabel,
  collectCodes,
  collectCodesByAction,
  normalizeSearch,
  splitPermissions,
} from "../lib/permissions";
import { Checkbox } from "./checkbox";

export interface PermissionMatrixProps {
  features: FeatureNode[];
  value: string[];
  onChange: (codes: string[]) => void;
  disabled?: boolean;
}

/**
 * Colunas da matriz em telas médias+: Funcionalidade | 4 × CRUD | Ações específicas.
 * Em telas estreitas a linha vira bloco e as ações quebram em wrap com rótulo visível.
 */
const GRID_COLUMNS = "md:grid md:grid-cols-[minmax(13rem,1fr)_repeat(4,5.5rem)_minmax(12rem,1.1fr)] md:items-center md:gap-x-2";

/** Em modo somente leitura não esmaecemos as caixas: o estado precisa continuar legível. */
const READ_ONLY_CLASS = "disabled:opacity-100 disabled:cursor-default";

const EXTRA_ICONS: Record<string, React.ReactNode> = {
  importar: <Upload className="h-3.5 w-3.5" aria-hidden />,
  exportar: <Download className="h-3.5 w-3.5" aria-hidden />,
};

/** Id da seção de um módulo na matriz (o resumo do perfil rola até ela). */
export function moduloAncora(key: string): string {
  return `permissoes-${key}`;
}

function selectionState(codes: string[], selected: Set<string>): boolean | "mixed" {
  const count = codes.filter((c) => selected.has(c)).length;
  if (count === 0) return false;
  return count === codes.length ? true : "mixed";
}

interface MatrixRow {
  node: FeatureNode;
  label: string;
  isModuleRoot: boolean;
}

/** Linhas visíveis de um módulo para a busca atual (nome do módulo, funcionalidade ou ação). */
function visibleRows(module: FeatureNode, query: string): MatrixRow[] {
  const rows: MatrixRow[] = [
    { node: module, label: "Acesso geral ao módulo", isModuleRoot: true },
    ...module.children.map((child) => ({ node: child, label: child.label, isModuleRoot: false })),
  ].filter((row) => row.node.permissions.length > 0);

  if (!query || normalizeSearch(module.label).includes(query)) return rows;

  return rows.filter(
    (row) =>
      normalizeSearch(row.label).includes(query) ||
      row.node.permissions.some((p) => normalizeSearch(actionLabel(p.action)).includes(query))
  );
}

/** Permissões agrupadas por módulo em formato de matriz: uma linha por funcionalidade, uma coluna por ação. */
export function PermissionMatrix({ features, value, onChange, disabled }: PermissionMatrixProps) {
  const [search, setSearch] = React.useState("");
  const query = normalizeSearch(search);
  const searchId = React.useId();

  const selected = new Set(value);
  const allCodes = features.flatMap(collectCodes);
  const selectedCount = allCodes.filter((c) => selected.has(c)).length;
  const lockClass = disabled ? READ_ONLY_CLASS : undefined;

  const setMany = (codes: string[], checked: boolean) => {
    const next = new Set(selected);
    codes.forEach((code) => (checked ? next.add(code) : next.delete(code)));
    onChange([...next]);
  };

  const modules = features
    .map((module) => ({ module, rows: visibleRows(module, query) }))
    .filter(({ rows }) => rows.length > 0);

  return (
    <div className="space-y-4">
      {/* Barra fixa no topo da área rolável: busca + resumo + ações em massa */}
      <div className="sticky top-0 z-10 -mx-1 flex flex-col gap-3 bg-background/95 px-1 py-3 backdrop-blur sm:flex-row sm:items-center">
        <div className="sm:max-w-xs sm:flex-1">
          <label htmlFor={searchId} className="sr-only">
            Buscar funcionalidade
          </label>
          <Input
            id={searchId}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar funcionalidade ou ação…"
            autoComplete="off"
            leftIcon={<Search className="h-4 w-4" aria-hidden />}
            rightIcon={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Limpar busca"
                  className="cursor-pointer rounded p-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
            className="h-9 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground tabular-nums">{selectedCount}</span> de{" "}
            <span className="tabular-nums">{allCodes.length}</span> permissões marcadas
          </p>
          {!disabled && (
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMany(allCodes, true)}
                disabled={selectedCount === allCodes.length}
              >
                Marcar todas
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMany(allCodes, false)}
                disabled={selectedCount === 0}
              >
                Limpar
              </Button>
            </div>
          )}
        </div>
      </div>

      {modules.length === 0 && (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">Nenhuma funcionalidade encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outro termo ou limpe a busca.</p>
        </div>
      )}

      {modules.map(({ module, rows }) => {
        const moduleCodes = collectCodes(module);
        const moduleSelected = moduleCodes.filter((c) => selected.has(c)).length;
        const allSelected = moduleSelected === moduleCodes.length && moduleCodes.length > 0;
        const headingId = `perm-module-${module.key}`;

        return (
          <section
            key={module.key}
            id={moduloAncora(module.key)}
            aria-labelledby={headingId}
            className="scroll-mt-20 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/50 px-5 py-3">
              <div className="flex items-center gap-3">
                <h3 id={headingId} className="font-display text-base font-semibold text-foreground">
                  {module.label}
                </h3>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                    allSelected
                      ? "bg-success/15 text-success"
                      : moduleSelected > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {moduleSelected} de {moduleCodes.length}
                </span>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMany(moduleCodes, !allSelected)}
                  aria-label={`${allSelected ? "Desmarcar" : "Marcar"} todas as permissões de ${module.label}`}
                >
                  {allSelected ? "Desmarcar tudo" : "Marcar tudo"}
                </Button>
              )}
            </header>

            {/* Cabeçalho de colunas (somente md+). Cada coluna CRUD pode ser marcada inteira. */}
            <div
              className={cn(
                "hidden border-b border-border px-5 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                GRID_COLUMNS
              )}
            >
              <span>Funcionalidade</span>
              {CRUD_ACTIONS.map((action) => {
                const columnCodes = collectCodesByAction(module, action);
                const label = actionLabel(action);
                if (disabled || columnCodes.length === 0) {
                  return (
                    <span key={action} className="text-center">
                      {label}
                    </span>
                  );
                }
                return (
                  <Checkbox
                    key={action}
                    checked={selectionState(columnCodes, selected)}
                    onChange={(checked) => setMany(columnCodes, checked)}
                    aria-label={`${label}: marcar coluna inteira em ${module.label}`}
                    label={label}
                    className="justify-self-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  />
                );
              })}
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" aria-hidden />
                Ações específicas
              </span>
            </div>

            <div className="divide-y divide-border">
              {rows.map(({ node, label, isModuleRoot }, index) => {
                const rowCodes = node.permissions.map((p) => p.code);
                const { crud, extras } = splitPermissions(node);

                return (
                  <div
                    key={node.key}
                    role="group"
                    aria-label={label}
                    className={cn(
                      "px-5 py-3 transition-colors hover:bg-muted/40",
                      GRID_COLUMNS,
                      isModuleRoot ? "bg-muted/25" : index % 2 === 0 && "bg-muted/10"
                    )}
                  >
                    <div className="min-w-0">
                      <Checkbox
                        checked={selectionState(rowCodes, selected)}
                        onChange={(checked) => setMany(rowCodes, checked)}
                        disabled={disabled}
                        aria-label={`Todas as permissões de ${isModuleRoot ? `${module.label} (acesso geral)` : label}`}
                        className={cn("max-w-full text-left", lockClass)}
                        label={
                          <span
                            className={cn(
                              "break-words",
                              isModuleRoot ? "font-medium italic text-muted-foreground" : "font-medium"
                            )}
                          >
                            {label}
                          </span>
                        }
                      />
                    </div>

                    {/* md:contents → as células abaixo viram colunas da grade em telas médias+ */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 pl-6 md:contents">
                      {CRUD_ACTIONS.map((action) => {
                        const permission = crud[action];
                        const actionName = actionLabel(action);
                        if (!permission) {
                          return (
                            <span
                              key={action}
                              className="hidden justify-center text-muted-foreground/50 md:flex"
                              title={`${actionName}: não se aplica`}
                            >
                              <span aria-hidden>—</span>
                              <span className="sr-only">{actionName}: não se aplica</span>
                            </span>
                          );
                        }
                        return (
                          <div key={action} className="md:flex md:justify-center">
                            <Checkbox
                              checked={selected.has(permission.code)}
                              onChange={(checked) => setMany([permission.code], checked)}
                              disabled={disabled}
                              aria-label={`${actionName} — ${label}`}
                              className={cn("p-1 md:-m-1", lockClass)}
                              label={<span className="text-muted-foreground md:sr-only">{actionName}</span>}
                            />
                          </div>
                        );
                      })}

                      <div className="flex basis-full flex-wrap items-center gap-2 md:basis-auto">
                        {extras.length === 0 ? (
                          <span className="hidden text-muted-foreground/50 md:inline" title="Sem ações específicas">
                            <span aria-hidden>—</span>
                            <span className="sr-only">Sem ações específicas</span>
                          </span>
                        ) : (
                          extras.map((permission) => {
                            const extraLabel = actionLabel(permission.action);
                            return (
                              <Checkbox
                                key={permission.code}
                                variant="pill"
                                checked={selected.has(permission.code)}
                                onChange={(checked) => setMany([permission.code], checked)}
                                disabled={disabled}
                                aria-label={`${extraLabel} — ${label}`}
                                icon={EXTRA_ICONS[permission.action] ?? <Zap className="h-3.5 w-3.5" aria-hidden />}
                                label={extraLabel}
                                className={lockClass}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
