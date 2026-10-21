import { cn } from "@/shared/lib/utils";
import type { RoleResponse } from "../types";
import { Checkbox } from "./checkbox";

export interface RolePickerProps {
  roles: RoleResponse[];
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

/** Escolha dos perfis de um usuário. */
export function RolePicker({ roles, value, onChange, error }: RolePickerProps) {
  const toggle = (id: string, checked: boolean) =>
    onChange(checked ? [...value, id] : value.filter((v) => v !== id));

  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 text-sm font-medium text-foreground">
        Perfis <span className="text-danger">*</span>
      </legend>
      <div className="max-h-56 space-y-1.5 overflow-y-auto">
        {roles.map((role) => {
          const checked = value.includes(role.id);
          return (
            <div
              key={role.id}
              className={cn(
                "rounded-lg border px-3 py-2.5 transition-colors",
                checked ? "border-primary/40 bg-primary/5" : "border-border"
              )}
            >
              <Checkbox
                checked={checked}
                onChange={(c) => toggle(role.id, c)}
                className="w-full text-left"
                label={
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{role.name}</span>
                    {role.description && (
                      <span className="block text-xs text-muted-foreground">{role.description}</span>
                    )}
                  </span>
                }
              />
            </div>
          );
        })}
        {roles.length === 0 && (
          <p className="text-xs text-muted-foreground">Nenhum perfil cadastrado. Crie um em Perfis e permissões.</p>
        )}
      </div>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </fieldset>
  );
}
