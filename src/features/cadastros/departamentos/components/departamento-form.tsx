import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { DepartamentoResponse } from "../types";
import { departamentoSchema, type DepartamentoFormData } from "../schemas";

export interface DepartamentoFormProps {
  initialData?: DepartamentoResponse | null;
  /** Valores iniciais de um cadastro novo (ex.: o texto buscado no cadastro rápido). */
  defaults?: Partial<DepartamentoFormData>;
  onSubmit: (data: DepartamentoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DepartamentoForm({ initialData, defaults, onSubmit, onCancel, isLoading }: DepartamentoFormProps) {
  const methods = useForm<DepartamentoFormData>({
    resolver: zodResolver(departamentoSchema),
    defaultValues: {
      nome: initialData?.nome ?? defaults?.nome ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome" placeholder="Ex: Extrusão" required autoFocus />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar departamento"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
