import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { TipoNaoConformidadeResponse } from "../types";
import { tipoNaoConformidadeSchema, type TipoNaoConformidadeFormData } from "../schemas";

export interface TipoNaoConformidadeFormProps {
  initialData?: TipoNaoConformidadeResponse | null;
  /** Valores iniciais de um cadastro novo (ex.: o texto buscado no cadastro rápido). */
  defaults?: Partial<TipoNaoConformidadeFormData>;
  onSubmit: (data: TipoNaoConformidadeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TipoNaoConformidadeForm({ initialData, defaults, onSubmit, onCancel, isLoading }: TipoNaoConformidadeFormProps) {
  const methods = useForm<TipoNaoConformidadeFormData>({
    resolver: zodResolver(tipoNaoConformidadeSchema),
    defaultValues: {
      nome: initialData?.nome ?? defaults?.nome ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome" placeholder="Ex: Inversão" required autoFocus />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar tipo"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
