import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { Button } from "@/shared/components/ui/button";
import { useDepartamentosQuery } from "@/features/cadastros/departamentos";
import type { OperadorResponse } from "../types";
import { operadorSchema, type OperadorFormData } from "../schemas";

export interface OperadorFormProps {
  initialData?: OperadorResponse | null;
  onSubmit: (data: OperadorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OperadorForm({ initialData, onSubmit, onCancel, isLoading }: OperadorFormProps) {
  const { data: departamentos, isLoading: isLoadingDepartamentos } = useDepartamentosQuery();

  const methods = useForm<OperadorFormData>({
    resolver: zodResolver(operadorSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      departamentoId: initialData?.departamento?.id ?? "",
    },
  });

  const departamentoOptions = React.useMemo(
    () => (departamentos || []).map((d) => ({ value: d.id, label: d.nome })),
    [departamentos]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome do operador" placeholder="Ex: Carlos Pereira" required autoFocus />

        <FormSearchSelect
          name="departamentoId"
          label="Departamento"
          placeholder="Sem departamento"
          searchPlaceholder="Buscar departamento"
          emptyMessage="Nenhum departamento com esse nome."
          options={departamentoOptions}
          isLoading={isLoadingDepartamentos}
          clearable
          hint="Opcional. Use o X para deixar o operador sem departamento."
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar operador"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
