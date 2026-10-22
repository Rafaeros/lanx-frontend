import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import { FormUsuarioVinculo } from "@/features/administracao/components/form-usuario-vinculo";
import type { CompradorResponse } from "../types";
import { compradorSchema, type CompradorFormData } from "../schemas";

export interface CompradorFormProps {
  initialData?: CompradorResponse | null;
  onSubmit: (data: CompradorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompradorForm({ initialData, onSubmit, onCancel, isLoading }: CompradorFormProps) {
  const methods = useForm<CompradorFormData>({
    resolver: zodResolver(compradorSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      userId: initialData?.usuario?.id ?? "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="nome"
          label="Nome no ERP"
          placeholder="Ex: MARIANA SILVA"
          hint="Exatamente como aparece nos pedidos importados: é por ele que a importação liga os itens."
          required
          autoFocus
        />

        <FormUsuarioVinculo
          usuarioAtual={initialData?.usuario}
          perfilPrioritario={/compra/i}
          hint="Opcional. Vincule para o comprador ver os próprios pedidos; use o X para desfazer."
        />

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar comprador"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
