import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialSchema, type MaterialFormData } from "../schemas";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { Button } from "@/shared/components/ui/button";
import { useUnidadesMedidaQuery } from "../api/use-materiais";
import type { MaterialResponse } from "@/shared/api/schema";

export interface MaterialFormProps {
  initialData?: MaterialResponse | null;
  onSubmit: (data: MaterialFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MaterialForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: MaterialFormProps) {
  const { data: unidades, isLoading: isLoadingUnidades } = useUnidadesMedidaQuery();

  const methods = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      codigo: initialData?.codigo ?? "",
      descricao: initialData?.descricao ?? "",
      unidadeMedidaId: initialData?.unidadeMedida?.id ?? "",
    },
  });

  const unidadeOptions = React.useMemo(() => {
    return (unidades || []).map((u) => ({
      value: u.id,
      label: `${u.sigla} - ${u.nome}`,
    }));
  }, [unidades]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="codigo"
          label="Código do Material"
          placeholder="Ex: MAT-1008"
          required
        />

        <FormInput
          name="descricao"
          label="Descrição Completa"
          placeholder="Ex: Flange Cego Aço Carbono 150 Lbs 4 pol"
          required
        />

        <FormSelect
          name="unidadeMedidaId"
          label="Unidade de Medida"
          placeholder={isLoadingUnidades ? "Carregando unidades..." : "Selecione uma unidade"}
          options={unidadeOptions}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {initialData ? "Salvar alterações" : "Cadastrar material"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
