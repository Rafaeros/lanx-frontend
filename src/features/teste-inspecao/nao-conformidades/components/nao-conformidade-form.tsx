import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Hash } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { withCurrentOption } from "@/shared/lib/options";
import { Button } from "@/shared/components/ui/button";
import { hojeIso } from "@/shared/lib/date";
import { formatDateBR } from "@/shared/lib/utils";
import { useDepartamentoQuickCreate, useDepartamentosQuery } from "@/features/cadastros/departamentos";
import { useOperadorQuickCreate, useOperadoresSearchQuery } from "@/features/cadastros/operadores";
import {
  useTipoNaoConformidadeQuickCreate,
  useTiposNaoConformidadeQuery,
} from "@/features/cadastros/tipos-nao-conformidade";
import { useOrdensProducaoQuery } from "@/features/producao/ordens-producao";
import type { NaoConformidadeResponse } from "../types";
import { naoConformidadeSchema, type NaoConformidadeFormData } from "../schemas";
import { AnexosInput } from "./anexos-input";

export interface NaoConformidadeFormProps {
  initialData?: NaoConformidadeResponse | null;
  onSubmit: (data: NaoConformidadeFormData, files: File[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NaoConformidadeForm({ initialData, onSubmit, onCancel, isLoading }: NaoConformidadeFormProps) {
  const { data: ordens, isLoading: isLoadingOrdens } = useOrdensProducaoQuery();
  const { data: tipos, isLoading: isLoadingTipos } = useTiposNaoConformidadeQuery();
  const { data: departamentos, isLoading: isLoadingDepartamentos } = useDepartamentosQuery();
  const { data: operadores, isLoading: isLoadingOperadores } = useOperadoresSearchQuery({}, 0, 200);
  const [files, setFiles] = React.useState<File[]>([]);

  const methods = useForm<NaoConformidadeFormData>({
    resolver: zodResolver(naoConformidadeSchema),
    defaultValues: {
      ordemDeProducaoId: initialData?.ordemDeProducao?.id ?? "",
      tipoNaoConformidadeId: initialData?.tipo?.id ?? "",
      departamentoId: initialData?.departamento?.id ?? "",
      operadorId: initialData?.operador?.id ?? "",
      quantidadeNaoConforme: initialData ? String(initialData.quantidadeNaoConforme).replace(".", ",") : "",
      dataNaoConformidade: initialData?.dataNaoConformidade ?? hojeIso(),
    },
  });

  const tipoQuickCreate = useTipoNaoConformidadeQuickCreate();
  const departamentoQuickCreate = useDepartamentoQuickCreate();
  // operador novo já nasce no departamento escolhido na NC
  const operadorQuickCreate = useOperadorQuickCreate({ departamentoId: methods.watch("departamentoId") });

  const ordemOptions = React.useMemo(() => {
    const atual = initialData?.ordemDeProducao;
    return withCurrentOption(
      (ordens || []).map((o) => ({
        value: o.id,
        label: o.codigo,
        description: [o.material?.codigo, o.cliente?.nome, `entrega ${formatDateBR(o.previsao)}`]
          .filter(Boolean)
          .join(" · "),
      })),
      atual && { value: atual.id, label: atual.codigo, description: atual.materialCodigo ?? undefined }
    );
  }, [ordens, initialData]);

  const tipoOptions = React.useMemo(
    () =>
      withCurrentOption(
        (tipos || []).map((t) => ({ value: t.id, label: t.nome })),
        initialData?.tipo && { value: initialData.tipo.id, label: initialData.tipo.nome }
      ),
    [tipos, initialData]
  );

  const departamentoOptions = React.useMemo(
    () =>
      withCurrentOption(
        (departamentos || []).map((d) => ({ value: d.id, label: d.nome })),
        initialData?.departamento && { value: initialData.departamento.id, label: initialData.departamento.nome }
      ),
    [departamentos, initialData]
  );

  const operadorOptions = React.useMemo(
    () =>
      withCurrentOption(
        (operadores?.items || []).map((o) => ({ value: o.id, label: o.nome, description: o.departamento?.nome })),
        initialData?.operador && { value: initialData.operador.id, label: initialData.operador.nome }
      ),
    [operadores, initialData]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => onSubmit(data, files))} className="space-y-4">
        <FormSearchSelect
          name="ordemDeProducaoId"
          label="Ordem de produção"
          placeholder="Selecione a OP"
          searchPlaceholder="Buscar por OP, produto ou cliente"
          emptyMessage="Nenhuma OP encontrada. Cadastre-a em Produção › Ordens de produção."
          options={ordemOptions}
          isLoading={isLoadingOrdens}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSearchSelect
            name="tipoNaoConformidadeId"
            label="Não conformidade"
            placeholder="Selecione o tipo"
            searchPlaceholder="Buscar tipo"
            emptyMessage="Nenhum tipo com esse nome."
            options={tipoOptions}
            isLoading={isLoadingTipos}
            quickCreate={tipoQuickCreate}
            required
          />
          <FormSearchSelect
            name="departamentoId"
            label="Departamento"
            placeholder="Selecione o departamento"
            searchPlaceholder="Buscar departamento"
            emptyMessage="Nenhum departamento encontrado."
            options={departamentoOptions}
            isLoading={isLoadingDepartamentos}
            quickCreate={departamentoQuickCreate}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            name="quantidadeNaoConforme"
            label="Qtd não conforme"
            inputMode="decimal"
            placeholder="Ex: 4"
            leftIcon={<Hash className="h-4 w-4" />}
            required
          />
          <FormInput
            name="dataNaoConformidade"
            type="date"
            label="Data"
            max={hojeIso()}
            leftIcon={<CalendarDays className="h-4 w-4" />}
            required
          />
          <FormSearchSelect
            name="operadorId"
            label="Operador"
            placeholder="Opcional"
            searchPlaceholder="Buscar operador"
            emptyMessage="Nenhum operador encontrado."
            options={operadorOptions}
            isLoading={isLoadingOperadores}
            quickCreate={operadorQuickCreate}
            clearable
          />
        </div>

        {/* Anexos só no cadastro: a edição muda os dados, não os arquivos */}
        {!initialData && (
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-foreground">Anexos</span>
            <AnexosInput files={files} onChange={setFiles} disabled={isLoading} />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Salvar alterações" : "Registrar não conformidade"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
