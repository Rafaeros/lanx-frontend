import * as React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, Eye, EyeOff, Lock, X } from "lucide-react";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { cn } from "@/shared/lib/utils";
import { authApi } from "../api/auth.api";
import { firstAccessStore, PASSWORD_RULES, type PendingFirstAccess } from "../lib/first-access";
import { firstAccessSchema, type FirstAccessFormData } from "../schemas";

function Requisitos({ senha, username }: { senha: string; username: string }) {
  return (
    <ul className="grid gap-1.5 rounded-lg border border-border bg-muted/40 p-3 text-xs sm:grid-cols-2" aria-live="polite">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(senha, username);
        return (
          <li key={rule.id} className={cn("flex items-center gap-1.5", ok ? "text-success" : "text-muted-foreground")}>
            {ok ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 opacity-60" />}
            <span>
              {rule.label}
              <span className="sr-only">{ok ? " (atendido)" : " (pendente)"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Define a senha do primeiro acesso a partir da credencial provisória guardada em memória pelo login. */
export function FirstAccessForm({ pending }: { pending: PendingFirstAccess }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const [mostrar, setMostrar] = React.useState(false);

  const methods = useForm<FirstAccessFormData>({
    resolver: zodResolver(firstAccessSchema(pending.username)),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const senha = useWatch({ control: methods.control, name: "newPassword" }) ?? "";

  const onSubmit = async (data: FirstAccessFormData) => {
    setErrorMessage(null);
    setIsPending(true);
    try {
      await authApi.firstAccess({
        username: pending.username,
        currentPassword: pending.password,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      firstAccessStore.clear();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      navigate(pending.redirect, { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Não foi possível definir a senha. Tente novamente."));
    } finally {
      setIsPending(false);
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setMostrar((m) => !m)}
      aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
      className="pointer-events-auto cursor-pointer text-muted-foreground hover:text-foreground"
    >
      {mostrar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3.5 text-sm text-danger">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FormInput
          name="newPassword"
          label="Nova senha"
          type={mostrar ? "text" : "password"}
          autoComplete="new-password"
          autoFocus
          required
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={toggle}
        />

        <Requisitos senha={senha} username={pending.username} />

        <FormInput
          name="confirmPassword"
          label="Confirmar nova senha"
          type={mostrar ? "text" : "password"}
          autoComplete="new-password"
          required
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full font-semibold" isLoading={isPending}>
          Definir senha e entrar
        </Button>
      </form>
    </FormProvider>
  );
}
