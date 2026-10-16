import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { UnidadeMedidaResponse } from "@/shared/api/schema";
import { unidadeMedidaSchema, type UnidadeMedidaFormData } from "../schemas";

export interface UnidadeMedidaFormProps {
  initialData?: UnidadeMedidaResponse | null;
  onSubmit: (data: UnidadeMedidaFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UnidadeMedidaForm({ initialData, onSubmit, onCancel, isLoading }: UnidadeMedidaFormProps) {
  const methods = useForm<UnidadeMedidaFormData>({
    resolver: zodResolver(unidadeMedidaSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      sigla: initialData?.sigla ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <FormInput name="nome" label="Nome" placeholder="Ex: Quilograma" required autoFocus />
          <FormInput name="sigla" label="Sigla" placeholder="Ex: KG" required />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar unidade"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
