import type { FeatureNode } from "@/shared/api/schema";
import { actionLabel, collectCodes } from "../lib/permissions";
import { Checkbox } from "./checkbox";

export interface PermissionMatrixProps {
  features: FeatureNode[];
  value: string[];
  onChange: (codes: string[]) => void;
  disabled?: boolean;
}

function selectionState(codes: string[], selected: Set<string>): boolean | "mixed" {
  const count = codes.filter((c) => selected.has(c)).length;
  if (count === 0) return false;
  return count === codes.length ? true : "mixed";
}

/** Permissões agrupadas por módulo: uma linha por funcionalidade, uma caixa por ação. */
export function PermissionMatrix({ features, value, onChange, disabled }: PermissionMatrixProps) {
  const selected = new Set(value);

  const setMany = (codes: string[], checked: boolean) => {
    const next = new Set(selected);
    codes.forEach((code) => (checked ? next.add(code) : next.delete(code)));
    onChange([...next]);
  };

  const renderRow = (node: FeatureNode, label: string) =>
    node.permissions.length > 0 && (
      <div
        key={`${node.key}-row`}
        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <Checkbox
          checked={selectionState(node.permissions.map((p) => p.code), selected)}
          onChange={(checked) => setMany(node.permissions.map((p) => p.code), checked)}
          disabled={disabled}
          label={<span className="font-medium">{label}</span>}
        />
        <div className="flex flex-wrap gap-x-4 gap-y-2 pl-6 sm:pl-0">
          {node.permissions.map((permission) => (
            <Checkbox
              key={permission.code}
              checked={selected.has(permission.code)}
              onChange={(checked) => setMany([permission.code], checked)}
              disabled={disabled}
              label={<span className="text-muted-foreground">{actionLabel(permission.action)}</span>}
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      {features.map((module) => {
        const moduleCodes = collectCodes(module);
        return (
          <section key={module.key} className="overflow-hidden rounded-xl border border-border">
            <header className="flex items-center justify-between gap-3 bg-muted/60 px-4 py-2.5">
              <Checkbox
                checked={selectionState(moduleCodes, selected)}
                onChange={(checked) => setMany(moduleCodes, checked)}
                disabled={disabled}
                label={<span className="font-semibold">{module.label}</span>}
              />
              <span className="text-xs text-muted-foreground">
                {moduleCodes.filter((c) => selected.has(c)).length} de {moduleCodes.length}
              </span>
            </header>
            <div className="divide-y divide-border">
              {renderRow(module, "Acesso geral ao módulo")}
              {module.children.map((child) => renderRow(child, child.label))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
