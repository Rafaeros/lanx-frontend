import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateClienteMutation } from "../hooks/use-clientes";
import { toClienteRequest } from "../schemas";
import { ClienteForm } from "./cliente-form";

function ClienteQuickCreateDialog({ termo, onClose, onCreated }: QuickCreateRenderProps) {
  const create = useCreateClienteMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Cliente cadastrado",
    erro: "Não foi possível cadastrar o cliente",
    toOption: (c) => ({ value: c.id, label: c.nome }),
    onCreated,
  });

  return (
    <QuickCreateDialog title="Novo cliente" onClose={onClose}>
      <ClienteForm
        defaults={{ nome: termo }}
        onSubmit={(data) => salvar(toClienteRequest(data))}
        onCancel={onClose}
        isLoading={create.isPending}
      />
    </QuickCreateDialog>
  );
}

/** Cadastro rápido de cliente para um FormSearchSelect; undefined sem permissão de cadastrar. */
export function useClienteQuickCreate(): QuickCreate | undefined {
  return useQuickCreate("cadastros.clientes:create", "Novo cliente", (props) => <ClienteQuickCreateDialog {...props} />);
}
