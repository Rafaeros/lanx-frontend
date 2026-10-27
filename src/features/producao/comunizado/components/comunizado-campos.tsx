import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, ClipboardList, Hash, Package, User } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";
import { FormField } from "@/shared/components/form/form-field";
import { SearchSelect } from "@/shared/components/ui/search-select";
import { useCan } from "@/features/auth/hooks/use-can";
import { useOrdensProducaoQuery } from "@/features/producao/ordens-producao";
import type { ComunizadoFormData } from "../lib/schema";

/** Título de um grupo de campos do formulário. */
function Grupo({ titulo, descricao, children }: { titulo: string; descricao: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1">
        <span className="block text-sm font-semibold text-foreground">{titulo}</span>
        <span className="block text-xs text-muted-foreground">{descricao}</span>
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/**
 * Escolher uma OP cadastrada preenche OP, quantidade e produto (código do material).
 * Os campos continuam editáveis; sem permissão para ler OPs, o seletor não aparece.
 */
function SeletorOrdemProducao({ disabled }: { disabled?: boolean }) {
  const { can } = useCan();
  const podeLer = can("producao.ordens-producao:read");
  const { data: ordens, isLoading } = useOrdensProducaoQuery(podeLer);
  const { control, setValue } = useFormContext<ComunizadoFormData>();
  const [selecionada, setSelecionada] = React.useState("");
  // Se o campo OP for editado à mão (ou o formulário limpo), o seletor volta a ficar vazio
  const op = useWatch({ control, name: "op" });
  const valor = ordens?.find((o) => o.id === selecionada)?.codigo === op ? selecionada : "";

  const options = React.useMemo(
    () =>
      (ordens || []).map((o) => ({
        value: o.id,
        label: o.codigo,
        description: [o.material?.codigo, o.cliente?.nome].filter(Boolean).join(" · "),
      })),
    [ordens]
  );

  if (!podeLer) return null;

  const escolher = (id: string) => {
    setSelecionada(id);
    const ordem = ordens?.find((o) => o.id === id);
    if (!ordem) return;
    const opcoes = { shouldDirty: true, shouldValidate: true };
    setValue("op", ordem.codigo, opcoes);
    setValue("quantidade", String(ordem.quantidade).replace(".", ","), opcoes);
    if (ordem.material) setValue("produto", ordem.material.codigo, opcoes);
  };

  return (
    <FormField
      label="Ordem de produção cadastrada"
      htmlFor="ordem-producao"
      hint="Opcional: preenche OP, quantidade e produto a partir da OP."
    >
      <SearchSelect
        id="ordem-producao"
        options={options}
        value={valor}
        onChange={escolher}
        placeholder="Preencher a partir de uma OP"
        searchPlaceholder="Buscar por OP, produto ou cliente"
        emptyMessage="Nenhuma OP encontrada."
        isLoading={isLoading}
        disabled={disabled}
        clearable
      />
    </FormField>
  );
}

/** Campos do cabeçalho do comunizado (dentro de um FormProvider). */
export function ComunizadoCampos({ disabled }: { disabled?: boolean }) {
  return (
    <div className="space-y-6">
      <SeletorOrdemProducao disabled={disabled} />

      <Grupo titulo="Produção" descricao="Não estão na IT. Em branco, saem vazios para preencher à mão.">
        <FormInput name="operador" label="Operador" placeholder="Ex.: João" leftIcon={<User className="h-4 w-4" />} disabled={disabled} />
        <FormInput name="op" label="OP" placeholder="Ordem de produção" leftIcon={<ClipboardList className="h-4 w-4" />} disabled={disabled} />
        <FormInput
          name="quantidade"
          label="Quantidade"
          placeholder="Ex.: 74"
          hint='Só o número vira "74 PÇS".'
          leftIcon={<Hash className="h-4 w-4" />}
          disabled={disabled}
        />
        <FormInput name="realizadoEm" type="date" label="Realizado em" leftIcon={<CalendarDays className="h-4 w-4" />} disabled={disabled} />
        <FormInput name="inicio" label="Início" placeholder="Ex.: 20/10 08:00" disabled={disabled} />
        <FormInput name="fim" label="Fim" placeholder="Ex.: 20/10 17:00" disabled={disabled} />
      </Grupo>

      <Grupo titulo="Sobrescrever a IT" descricao="Opcional: por padrão vêm do cabeçalho da IT.">
        <FormInput
          name="produto"
          label="Produto"
          placeholder='"Código" da IT'
          hint="Obrigatório só se a IT não tiver o código."
          leftIcon={<Package className="h-4 w-4" />}
          disabled={disabled}
        />
        <FormInput name="docReferencia" type="date" label="Doc. referência" hint="Data da revisão da IT." disabled={disabled} />
      </Grupo>
    </div>
  );
}
