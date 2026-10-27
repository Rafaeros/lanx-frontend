import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FeatureNode, RoleResponse } from "../types";
import { perfilSchema, type PerfilFormData } from "../lib/schemas";
import { PerfilDadosCard } from "./perfil-dados-card";
import { PerfilFormAcoes } from "./perfil-form-acoes";
import { PerfilResumoModulos } from "./perfil-resumo-modulos";
import { PermissionMatrix } from "./permission-matrix";

export interface PerfilFormProps {
  initialData?: RoleResponse | null;
  features: FeatureNode[];
  readOnly?: boolean;
  onSubmit: (data: PerfilFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Formulário de perfil em tela cheia: dados e resumo numa coluna lateral (fixa no desktop),
 * a matriz de permissões ocupando o resto e a barra de ações sempre visível no rodapé.
 */
export function PerfilForm({ initialData, features, readOnly, onSubmit, onCancel, isLoading }: PerfilFormProps) {
  const methods = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      permissions: initialData?.permissions ?? [],
    },
  });
  const permissions = useWatch({ control: methods.control, name: "permissions" }) ?? [];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid items-start gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="space-y-5 xl:sticky xl:top-0">
            <PerfilDadosCard readOnly={readOnly} autoFocus={!initialData && !readOnly} />
            <PerfilResumoModulos features={features} value={permissions} />
          </aside>

          <Controller
            name="permissions"
            control={methods.control}
            render={({ field, fieldState }) => (
              <fieldset className="min-w-0">
                <legend className="sr-only">Permissões</legend>
                <div className="mb-1">
                  <h2 className="font-display text-lg font-semibold text-foreground">Permissões</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Visualizar, Criar, Editar e Excluir valem por funcionalidade. Ações específicas, como Importar e
                    Exportar, aparecem na última coluna.
                  </p>
                </div>
                {fieldState.error && (
                  <p role="alert" className="mt-2 text-sm font-medium text-danger">
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

        <PerfilFormAcoes
          readOnly={readOnly}
          editando={!!initialData}
          marcadas={permissions.length}
          isLoading={isLoading}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}
