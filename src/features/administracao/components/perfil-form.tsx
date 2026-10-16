import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { FeatureNode, RoleResponse } from "@/shared/api/schema";
import { perfilSchema, type PerfilFormData } from "../lib/schemas";
import { PermissionMatrix } from "./permission-matrix";

export interface PerfilFormProps {
  initialData?: RoleResponse | null;
  features: FeatureNode[];
  readOnly?: boolean;
  onSubmit: (data: PerfilFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PerfilForm({ initialData, features, readOnly, onSubmit, onCancel, isLoading }: PerfilFormProps) {
  const methods = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      permissions: initialData?.permissions ?? [],
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
          <FormInput
            name="name"
            label="Nome"
            placeholder="Ex: COMPRADOR"
            hint="Gravado em maiúsculas."
            required
            disabled={readOnly}
            autoFocus={!initialData}
          />
          <FormInput
            name="description"
            label="Descrição"
            placeholder="O que este perfil pode fazer"
            disabled={readOnly}
          />
        </div>

        <Controller
          name="permissions"
          control={methods.control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">Permissões</span>
                <span className="text-xs text-muted-foreground">{field.value.length} marcadas</span>
              </div>
              <div className="max-h-[50vh] overflow-y-auto pr-1">
                <PermissionMatrix
                  features={features}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              </div>
              {fieldState.error && <p className="text-xs font-medium text-danger">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {readOnly ? "Fechar" : "Cancelar"}
          </Button>
          {!readOnly && (
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {initialData ? "Salvar alterações" : "Criar perfil"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
