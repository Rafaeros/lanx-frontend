import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateOperadorMutation } from "../hooks/use-operadores";
import { toOperadorRequest, type OperadorFormData } from "../schemas";
import { OperadorForm } from "./operador-form";

type Props = QuickCreateRenderProps & { defaults?: Partial<OperadorFormData> };

function OperadorQuickCreateDialog({ termo, onClose, onCreated, defaults }: Props) {
  const create = useCreateOperadorMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Operador cadastrado",
    erro: "Não foi possível cadastrar o operador",
    toOption: (o) => ({ value: o.id, label: o.nome, description: o.departamento?.nome }),
    onCreated,
  });

  return (
    <QuickCreateDialog title="Novo operador" onClose={onClose}>
      <OperadorForm
        defaults={{ ...defaults, nome: termo }}
        onSubmit={(data) => salvar(toOperadorRequest(data))}
        onCancel={onClose}
        isLoading={create.isPending}
      />
    </QuickCreateDialog>
  );
}

/**
 * Cadastro rápido de operador para um FormSearchSelect; undefined sem permissão. `defaults` preenche
 * outros campos (ex.: o departamento já escolhido na não conformidade).
 */
export function useOperadorQuickCreate(defaults?: Partial<OperadorFormData>): QuickCreate | undefined {
  return useQuickCreate("cadastros.operadores:create", "Novo operador", (props) => (
    <OperadorQuickCreateDialog {...props} defaults={defaults} />
  ));
}
