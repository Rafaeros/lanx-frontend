import { QuickCreateDialog, useQuickCreateSave } from "@/shared/components/form/quick-create-dialog";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useQuickCreate } from "@/features/auth/hooks/use-quick-create";
import { useCreateMaterialMutation } from "../api/use-materiais";
import type { MaterialFormData } from "../schemas";
import { MaterialForm } from "./material-form";

type Props = QuickCreateRenderProps & { defaults?: Partial<MaterialFormData> };

function MaterialQuickCreateDialog({ termo, onClose, onCreated, defaults }: Props) {
  const create = useCreateMaterialMutation();
  const salvar = useQuickCreateSave(create, {
    sucesso: "Material cadastrado",
    erro: "Não foi possível cadastrar o material",
    toOption: (m) => ({ value: m.id, label: m.codigo, description: m.descricao }),
    onCreated,
  });

  return (
    <QuickCreateDialog title="Novo material" onClose={onClose} maxWidth="lg">
      <MaterialForm
        defaults={{ ...defaults, codigo: termo }}
        onSubmit={salvar}
        onCancel={onClose}
        isLoading={create.isPending}
      />
    </QuickCreateDialog>
  );
}

/**
 * Cadastro rápido de material para um FormSearchSelect; undefined sem permissão. O texto buscado
 * vira o código; `defaults` fixa outros campos (ex.: tipo produto acabado na OP).
 */
export function useMaterialQuickCreate(defaults?: Partial<MaterialFormData>): QuickCreate | undefined {
  return useQuickCreate("cadastros.materiais:create", "Novo material", (props) => (
    <MaterialQuickCreateDialog {...props} defaults={defaults} />
  ));
}
