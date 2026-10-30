import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import { FormDepartamentoSelect } from "@/features/cadastros/departamentos";
import { FormUsuarioVinculo } from "@/features/administracao/components/form-usuario-vinculo";
import type { OperadorResponse } from "../types";
import { operadorSchema, type OperadorFormData } from "../schemas";

export interface OperadorFormProps {
  initialData?: OperadorResponse | null;
  /** Valores iniciais de um cadastro novo (ex.: o texto buscado no cadastro rápido). */
  defaults?: Partial<OperadorFormData>;
  onSubmit: (data: OperadorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OperadorForm({ initialData, defaults, onSubmit, onCancel, isLoading }: OperadorFormProps) {
  const methods = useForm<OperadorFormData>({
    resolver: zodResolver(operadorSchema),
    defaultValues: {
      nome: initialData?.nome ?? defaults?.nome ?? "",
      departamentoId: initialData?.departamento?.id ?? defaults?.departamentoId ?? "",
      userId: initialData?.usuario?.id ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="nome" label="Nome do operador" placeholder="Ex: Carlos Pereira" required autoFocus />

        <FormDepartamentoSelect hint="Opcional. Use o X para deixar o operador sem departamento." />

        <FormUsuarioVinculo
          usuarioAtual={initialData?.usuario}
          perfilPrioritario={/opera|produ/i}
          hint="Opcional. Cada usuário pode ser de um único operador; use o X para desfazer."
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
