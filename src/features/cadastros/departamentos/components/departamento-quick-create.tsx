import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateDepartamentoMutation } from "../hooks/use-departamentos";
import { toDepartamentoRequest } from "../schemas";
import { DepartamentoForm } from "./departamento-form";

function DepartamentoQuickCreateDialog({ termo, onClose, onCreated }: QuickCreateRenderProps) {
  const create = useCreateDepartamentoMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Departamento cadastrado",
    erro: "Não foi possível cadastrar o departamento",
    toOption: (d) => ({ value: d.id, label: d.nome }),
    onCreated,
  });

  return (
    <QuickCreateDialog title="Novo departamento" onClose={onClose}>
      <DepartamentoForm
        defaults={{ nome: termo }}
        onSubmit={(data) => salvar(toDepartamentoRequest(data))}
        onCancel={onClose}
        isLoading={create.isPending}
      />
    </QuickCreateDialog>
  );
}

/** Cadastro rápido de departamento para um FormSearchSelect; undefined sem permissão de cadastrar. */
export function useDepartamentoQuickCreate(): QuickCreate | undefined {
  return useQuickCreate("cadastros.departamentos:create", "Novo departamento", (props) => (
    <DepartamentoQuickCreateDialog {...props} />
  ));
}
