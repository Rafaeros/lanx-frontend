import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { FormField } from "@/shared/components/form/form-field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { ClienteResponse } from "../types";
import { clienteSchema, type ClienteFormData } from "../schemas";
import { formatCnpj } from "../lib/cnpj";

export interface ClienteFormProps {
  initialData?: ClienteResponse | null;
  onSubmit: (data: ClienteFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClienteForm({ initialData, onSubmit, onCancel, isLoading }: ClienteFormProps) {
  const methods = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      cnpj: formatCnpj(initialData?.cnpj),
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome" placeholder="Ex: CLIENTE EXEMPLO LTDA" required autoFocus />

        {/* Máscara enquanto digita; o backend recebe só os dígitos */}
        <Controller
          name="cnpj"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <FormField label="CNPJ" htmlFor="cnpj" error={error?.message} hint="Opcional.">
              <Input
                id="cnpj"
                {...field}
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatCnpj(e.target.value))}
                error={error?.message}
                showErrorMessage={false}
              />
            </FormField>
          )}
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar cliente"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
