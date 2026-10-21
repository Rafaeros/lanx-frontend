import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fornecedorSchema, type FornecedorFormData } from "../schemas";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { Button } from "@/shared/components/ui/button";
import { usePaisesQuery } from "../api/use-fornecedores";
import type { FornecedorResponse } from "../types";

export interface FornecedorFormProps {
  initialData?: FornecedorResponse | null;
  onSubmit: (data: FornecedorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FornecedorForm({ initialData, onSubmit, onCancel, isLoading }: FornecedorFormProps) {
  const { data: paises, isLoading: isLoadingPaises } = usePaisesQuery();

  const methods = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      paisId: initialData?.pais?.id ?? "",
    },
  });

  const paisOptions = React.useMemo(
    () => [
      { value: "", label: "Sem país" },
      ...(paises || []).map((p) => ({ value: p.id, label: `${p.nome} (${p.codigoIso2})` })),
    ],
    [paises]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome do Fornecedor" placeholder="Ex: Aço Tubos Tubulares SA" required />

        <FormSelect
          name="paisId"
          label="País"
          placeholder={isLoadingPaises ? "Carregando países..." : "Sem país"}
          options={paisOptions}
          hint="Opcional. Itens importados do ERP preenchem o país automaticamente quando ele é reconhecido."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar fornecedor"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
