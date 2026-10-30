import * as React from "react";
import { FormSearchSelect } from "@/shared/components/form/form-search-select";
import { useDepartamentosQuery } from "../hooks/use-departamentos";
import { useDepartamentoQuickCreate } from "./departamento-quick-create";

export interface FormDepartamentoSelectProps {
  /** Campo do formulário com o id do departamento ("" = sem departamento). */
  name?: string;
  label?: string;
  hint?: string;
}

/** Departamento opcional de um cadastro (operador, usuário): busca por nome e cadastro rápido. */
export function FormDepartamentoSelect({
  name = "departamentoId",
  label = "Departamento",
  hint = "Opcional. Use o X para deixar sem departamento.",
}: FormDepartamentoSelectProps) {
  const { data: departamentos, isLoading } = useDepartamentosQuery();
  const quickCreate = useDepartamentoQuickCreate();

  const options = React.useMemo(
    () => (departamentos || []).map((d) => ({ value: d.id, label: d.nome })),
    [departamentos]
  );

  return (
    <FormSearchSelect
      name={name}
      label={label}
      placeholder="Sem departamento"
      searchPlaceholder="Buscar departamento"
      emptyMessage="Nenhum departamento com esse nome."
      options={options}
      isLoading={isLoading}
      quickCreate={quickCreate}
      clearable
      hint={hint}
    />
  );
}
