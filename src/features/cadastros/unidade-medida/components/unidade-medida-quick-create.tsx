import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateUnidadeMedidaMutation } from "../hooks/use-unidades-medida";
import { UnidadeMedidaForm } from "./unidade-medida-form";

/** O texto buscado vira a sigla se for curto e sem espaço (ex.: "KG"), senão o nome. */
const SIGLA_MAX = 6;

function UnidadeMedidaQuickCreateDialog({ termo, onClose, onCreated }: QuickCreateRenderProps) {
  const create = useCreateUnidadeMedidaMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Unidade cadastrada",
    erro: "Não foi possível cadastrar a unidade",
    // a API devolve só o id: o rótulo sai do que foi enviado (mesmo formato do select de materiais)
    toOption: ({ id }, request) => ({ value: id, label: `${request.sigla.trim()} - ${request.nome.trim()}` }),
    onCreated,
  });
  const defaults = termo && termo.length <= SIGLA_MAX && !termo.includes(" ") ? { sigla: termo } : { nome: termo };

  return (
    <QuickCreateDialog title="Nova unidade de medida" onClose={onClose}>
      <UnidadeMedidaForm defaults={defaults} onSubmit={salvar} onCancel={onClose} isLoading={create.isPending} />
    </QuickCreateDialog>
  );
}

/** Cadastro rápido de unidade de medida para um FormSearchSelect; undefined sem permissão. */
export function useUnidadeMedidaQuickCreate(): QuickCreate | undefined {
  return useQuickCreate("cadastros.unidade-medida:create", "Nova unidade", (props) => (
    <UnidadeMedidaQuickCreateDialog {...props} />
  ));
}
