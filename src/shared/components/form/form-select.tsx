import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormField } from "./form-field";
import { cn } from "@/shared/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
}

export function FormSelect({
  name,
  label,
  options,
  placeholder = "Selecione uma opção",
  hint,
  required,
  className,
  ...props
}: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormField
          label={label}
          htmlFor={name}
          error={error?.message}
          hint={hint}
          required={required}
        >
          <select
            id={name}
            {...props}
            {...field}
            value={field.value ?? ""}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-danger focus:ring-danger",
              className
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      )}
    />
  );
}

