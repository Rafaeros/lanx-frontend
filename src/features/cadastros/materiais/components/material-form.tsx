import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialSchema, type MaterialFormData } from "../schemas";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { useUnidadeMedidaQuickCreate } from "@/features/cadastros/unidade-medida";
import { TIPOS_MATERIAL } from "../lib/tipo-material";
import { Button } from "@/shared/components/ui/button";
import { useUnidadesMedidaQuery } from "../api/use-materiais";
import type { MaterialResponse } from "../types";

export interface MaterialFormProps {
  initialData?: MaterialResponse | null;
  /** Valores iniciais de um cadastro novo (ex.: o texto buscado no cadastro rápido). */
  defaults?: Partial<MaterialFormData>;
  onSubmit: (data: MaterialFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MaterialForm({
  initialData,
  defaults,
  onSubmit,
  onCancel,
  isLoading,
}: MaterialFormProps) {
  const { data: unidades, isLoading: isLoadingUnidades } = useUnidadesMedidaQuery();
  const unidadeQuickCreate = useUnidadeMedidaQuickCreate();

  const methods = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      codigo: initialData?.codigo ?? defaults?.codigo ?? "",
      descricao: initialData?.descricao ?? defaults?.descricao ?? "",
      unidadeMedidaId: initialData?.unidadeMedida?.id ?? defaults?.unidadeMedidaId ?? "",
      tipo: initialData?.tipo ?? defaults?.tipo ?? "MATERIA_PRIMA",
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSearchSelect
            name="unidadeMedidaId"
            label="Unidade de Medida"
            placeholder="Selecione uma unidade"
            searchPlaceholder="Buscar por sigla ou nome"
            emptyMessage="Nenhuma unidade com esse nome."
            options={unidadeOptions}
            isLoading={isLoadingUnidades}
            quickCreate={unidadeQuickCreate}
            required
          />
          <FormSelect
            name="tipo"
            label="Tipo"
            options={TIPOS_MATERIAL.map((t) => ({ value: t.value, label: t.label }))}
            hint="Itens importados das compras entram como matéria-prima."
            required
          />
        </div>

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
