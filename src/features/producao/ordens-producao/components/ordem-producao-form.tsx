import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ClipboardList, Hash } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { Button } from "@/shared/components/ui/button";
import { hojeIso } from "@/shared/lib/date";
import { useClientesQuery } from "@/features/cadastros/clientes";
import { useMateriaisQuery } from "@/features/cadastros/materiais";
import type { OrdemProducaoResponse } from "../types";
import { ordemProducaoSchema, type OrdemProducaoFormData } from "../schemas";

export interface OrdemProducaoFormProps {
  initialData?: OrdemProducaoResponse | null;
  onSubmit: (data: OrdemProducaoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/** A OP fabrica um produto acabado: o select só lista materiais desse tipo. */
const FILTRO_PRODUTOS = { tipo: "PRODUTO_ACABADO" } as const;

export function OrdemProducaoForm({ initialData, onSubmit, onCancel, isLoading }: OrdemProducaoFormProps) {
  const { data: clientes, isLoading: isLoadingClientes } = useClientesQuery();
  const { data: produtos, isLoading: isLoadingProdutos } = useMateriaisQuery(FILTRO_PRODUTOS, 0, 200);

  const methods = useForm<OrdemProducaoFormData>({
    resolver: zodResolver(ordemProducaoSchema),
    defaultValues: {
      codigo: initialData?.codigo ?? "",
      clienteId: initialData?.cliente?.id ?? "",
      materialId: initialData?.material?.id ?? "",
      quantidade: initialData ? String(initialData.quantidade).replace(".", ",") : "",
      previsao: initialData?.previsao ?? hojeIso(),
      etapaAtual: initialData?.etapaAtual ?? "",
    },
  });

  const clienteOptions = React.useMemo(
    () => (clientes || []).map((c) => ({ value: c.id, label: c.nome })),
    [clientes]
  );

  // Mantém o produto atual da OP como opção, mesmo que ele tenha deixado de ser produto acabado
  const produtoOptions = React.useMemo(() => {
    const options = (produtos?.items || []).map((m) => ({ value: m.id, label: m.codigo, description: m.descricao }));
    const atual = initialData?.material;
    if (atual && !options.some((o) => o.value === atual.id)) {
      options.unshift({ value: atual.id, label: atual.codigo, description: atual.descricao });
    }
    return options;
  }, [produtos, initialData]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            name="codigo"
            label="Código da OP"
            placeholder="Ex: OP-0001"
            leftIcon={<ClipboardList className="h-4 w-4" />}
            required
            autoFocus
          />
          <FormInput
            name="previsao"
            type="date"
            label="Previsão de entrega"
            leftIcon={<CalendarDays className="h-4 w-4" />}
            required
          />
        </div>

        <FormSearchSelect
          name="clienteId"
          label="Cliente"
          placeholder="Selecione o cliente"
          searchPlaceholder="Buscar cliente"
          emptyMessage="Nenhum cliente com esse nome. Cadastre-o em Cadastros › Clientes."
          options={clienteOptions}
          isLoading={isLoadingClientes}
          required
        />

        <FormSearchSelect
          name="materialId"
          label="Produto"
          placeholder="Selecione o produto acabado"
          searchPlaceholder="Buscar por código ou descrição"
          emptyMessage="Nenhum produto acabado encontrado."
          options={produtoOptions}
          isLoading={isLoadingProdutos}
          hint="Só materiais do tipo produto acabado (Cadastros › Materiais)."
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            name="quantidade"
            label="Quantidade"
            inputMode="decimal"
            placeholder="Ex: 74"
            leftIcon={<Hash className="h-4 w-4" />}
            required
          />
          <FormInput name="etapaAtual" label="Etapa atual" placeholder="Ex: Corte" hint="Vazio = não iniciada." />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Cadastrar OP"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
