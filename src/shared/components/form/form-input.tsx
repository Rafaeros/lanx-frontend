import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormField } from "./form-field";
import { Input, type InputProps } from "../ui/input";

export interface FormInputProps extends Omit<InputProps, "name"> {
  name: string;
  label?: string;
  hint?: string;
  required?: boolean;
}

export function FormInput({
  name,
  label,
  hint,
  required,
  ...props
}: FormInputProps) {
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
          <Input
            id={name}
            {...props}
            {...field}
            value={field.value ?? ""}
            error={error?.message}
          />
        </FormField>
      )}
    />
  );
}

