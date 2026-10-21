import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { FeatureNode, RoleResponse } from "../types";
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
      {/* Corpo rolável + rodapé sempre visível (o Dialog usa `scrollable`). */}
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="-mx-6 min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-4">
          <div className="grid gap-4 sm:grid-cols-[16rem_1fr]">
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
              <fieldset className="min-w-0 border-t border-border pt-4">
                <legend className="sr-only">Permissões</legend>
                <h3 className="font-display text-base font-semibold text-foreground">Permissões</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Visualizar, Criar, Editar e Excluir valem por funcionalidade. Ações específicas, como Importar e
                  Exportar, aparecem na última coluna.
                </p>
                {fieldState.error && (
                  <p role="alert" className="mt-2 text-xs font-medium text-danger">
                    {fieldState.error.message}
                  </p>
                )}
                <PermissionMatrix
                  features={features}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              </fieldset>
            )}
          />
        </div>

        <div className="-mx-6 -mb-6 flex shrink-0 items-center justify-end gap-3 rounded-b-2xl border-t border-border bg-card px-6 py-4">
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
