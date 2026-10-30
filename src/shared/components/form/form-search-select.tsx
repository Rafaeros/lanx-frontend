import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormField } from "./form-field";
import { SearchSelect, type SearchSelectOption } from "../ui/search-select";
import type { QuickCreate } from "./quick-create";

export interface FormSearchSelectProps {
  name: string;
  label?: string;
  options: SearchSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  hint?: string;
  required?: boolean;
  /** Permite voltar para "" (ex.: campo opcional como "Sem departamento"). */
  clearable?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  /** Cadastro rápido pelo rodapé da lista (ex.: useDepartamentoQuickCreate()). */
  quickCreate?: QuickCreate;
}

/** SearchSelect ligado ao react-hook-form, com label, dica e erro do FormField. */
export function FormSearchSelect({ name, label, hint, required, options, quickCreate, ...props }: FormSearchSelectProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const [termo, setTermo] = React.useState<string | null>(null);
  // Criados aqui ficam como opção até a lista recarregar com eles
  const [criadas, setCriadas] = React.useState<SearchSelectOption[]>([]);

  const todas = React.useMemo(
    () => [...criadas.filter((c) => !options.some((o) => o.value === c.value)), ...options],
    [criadas, options]
  );

  return (
    <FormField label={label} htmlFor={name} error={fieldState.error?.message} hint={hint} required={required}>
      <SearchSelect
        {...props}
        options={todas}
        ref={field.ref}
        id={name}
        name={field.name}
        value={field.value ?? ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        invalid={!!fieldState.error}
        onCreate={quickCreate ? setTermo : undefined}
        createLabel={quickCreate?.label}
      />
      {quickCreate &&
        termo !== null &&
        quickCreate.render({
          termo,
          onClose: () => setTermo(null),
          onCreated: (option) => {
            setCriadas((atuais) => [option, ...atuais]);
            field.onChange(option.value);
            setTermo(null);
          },
        })}
    </FormField>
  );
}
