import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { RateioResponse } from "../types";
import { rateioSchema, type RateioFormData } from "../schemas";

export interface RateioFormProps {
  initialData?: RateioResponse | null;
  onSubmit: (data: RateioFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RateioForm({ initialData, onSubmit, onCancel, isLoading }: RateioFormProps) {
  const methods = useForm<RateioFormData>({
    resolver: zodResolver(rateioSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome" placeholder="Ex: MATERIA-PRIMA" required autoFocus />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar rateio"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
