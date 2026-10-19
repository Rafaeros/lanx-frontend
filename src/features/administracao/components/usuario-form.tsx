import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import type { RoleResponse, UserResponse } from "@/shared/api/schema";
import {
  editarUsuarioSchema,
  novoUsuarioSchema,
  type EditarUsuarioFormData,
  type NovoUsuarioFormData,
} from "../lib/schemas";
import { RolePicker } from "./role-picker";
import { Checkbox } from "./checkbox";

interface FormActionsProps {
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel: string;
}

function FormActions({ onCancel, isLoading, submitLabel }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button type="submit" variant="primary" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </div>
  );
}

export function NovoUsuarioForm({
  roles,
  onSubmit,
  onCancel,
  isLoading,
}: {
  roles: RoleResponse[];
  onSubmit: (data: NovoUsuarioFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const methods = useForm<NovoUsuarioFormData>({
    resolver: zodResolver(novoUsuarioSchema),
    defaultValues: { username: "", password: "", roleIds: [] },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="username"
          label="Usuário"
          placeholder="nome.sobrenome"
          hint="Letras minúsculas, números, ponto, hífen ou sublinhado."
          autoComplete="off"
          required
          autoFocus
          leftIcon={<User className="h-4 w-4" />}
        />
        <FormInput
          name="password"
          type="password"
          label="Senha provisória"
          hint="Mínimo de 8 caracteres, com letras e números. No primeiro login o usuário define a própria senha."
          autoComplete="new-password"
          required
          leftIcon={<Lock className="h-4 w-4" />}
        />
        <Controller
          name="roleIds"
          control={methods.control}
          render={({ field, fieldState }) => (
            <RolePicker roles={roles} value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <FormActions onCancel={onCancel} isLoading={isLoading} submitLabel="Cadastrar usuário" />
      </form>
    </FormProvider>
  );
}

export function EditarUsuarioForm({
  user,
  roles,
  isSelf,
  onSubmit,
  onCancel,
  isLoading,
}: {
  user: UserResponse;
  roles: RoleResponse[];
  /** O próprio usuário logado: não pode se desativar. */
  isSelf: boolean;
  onSubmit: (data: EditarUsuarioFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const methods = useForm<EditarUsuarioFormData>({
    resolver: zodResolver(editarUsuarioSchema),
    defaultValues: { roleIds: user.roles.map((r) => r.id), active: user.active },
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5">
        <p className="text-xs text-muted-foreground">Usuário</p>
        <p className="font-mono text-sm font-semibold text-foreground">{user.username}</p>
      </div>

      <Controller
        name="roleIds"
        control={methods.control}
        render={({ field, fieldState }) => (
          <RolePicker roles={roles} value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
        )}
      />

      <Controller
        name="active"
        control={methods.control}
        render={({ field }) => (
          <div className="space-y-1">
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              disabled={isSelf}
              label={<span className="font-medium">Usuário ativo</span>}
            />
            <p className="pl-6 text-xs text-muted-foreground">
              {isSelf
                ? "Você não pode desativar o seu próprio usuário."
                : "Usuários inativos não conseguem entrar no sistema."}
            </p>
          </div>
        )}
      />

      <FormActions onCancel={onCancel} isLoading={isLoading} submitLabel="Salvar alterações" />
    </form>
  );
}
