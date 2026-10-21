import { useFormContext, Controller } from "react-hook-form";
import { FormField } from "./form-field";
import { SearchSelect, type SearchSelectOption } from "../ui/search-select";

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
}

/** SearchSelect ligado ao react-hook-form, com label, dica e erro do FormField. */
export function FormSearchSelect({ name, label, hint, required, ...props }: FormSearchSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormField label={label} htmlFor={name} error={error?.message} hint={hint} required={required}>
          <SearchSelect
            {...props}
            ref={field.ref}
            id={name}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            invalid={!!error}
          />
        </FormField>
      )}
    />
  );
}
