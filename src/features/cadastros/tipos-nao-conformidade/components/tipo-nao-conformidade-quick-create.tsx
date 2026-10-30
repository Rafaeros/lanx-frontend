import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateTipoNaoConformidadeMutation } from "../hooks/use-tipos-nao-conformidade";
import { toTipoNaoConformidadeRequest } from "../schemas";
import { TipoNaoConformidadeForm } from "./tipo-nao-conformidade-form";

function TipoNaoConformidadeQuickCreateDialog({ termo, onClose, onCreated }: QuickCreateRenderProps) {
  const create = useCreateTipoNaoConformidadeMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Tipo cadastrado",
    erro: "Não foi possível cadastrar o tipo",
    toOption: (t) => ({ value: t.id, label: t.nome }),
    onCreated,
  });

  return (
    <QuickCreateDialog title="Novo tipo de não conformidade" onClose={onClose}>
      <TipoNaoConformidadeForm
        defaults={{ nome: termo }}
        onSubmit={(data) => salvar(toTipoNaoConformidadeRequest(data))}
        onCancel={onClose}
        isLoading={create.isPending}
      />
    </QuickCreateDialog>
  );
}

/** Cadastro rápido de tipo de não conformidade para um FormSearchSelect; undefined sem permissão. */
export function useTipoNaoConformidadeQuickCreate(): QuickCreate | undefined {
  return useQuickCreate("cadastros.tipos-nao-conformidade:create", "Novo tipo", (props) => (
    <TipoNaoConformidadeQuickCreateDialog {...props} />
  ));
}
