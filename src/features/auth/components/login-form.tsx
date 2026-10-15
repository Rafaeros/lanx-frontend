import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas";
import { useLogin } from "../api/use-login";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import { Lock, User, AlertCircle, ArrowRight } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/cadastros/materiais";

  const { mutate: login, isPending } = useLogin();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    login(data, {
      onSuccess: () => {
        navigate(redirectUrl);
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Credenciais inválidas. Verifique seu usuário e senha.";
        setErrorMessage(msg);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FormInput
          name="username"
          label="Usuário ou Email"
          placeholder="admin"
          autoComplete="username"
          required
          leftIcon={<User className="h-4 w-4" />}
        />

        <FormInput
          name="password"
          label="Senha de Acesso"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-[var(--card-border)] text-[var(--brand-purple)] focus:ring-[var(--brand-purple)]"
              defaultChecked
            />
            <span>Lembrar meu acesso</span>
          </label>
          <a
            href="#recuperar"
            onClick={(e) => {
              e.preventDefault();
              alert("Entre em contato com o administrador do sistema para redefinir sua senha.");
            }}
            className="hover:text-[var(--brand-purple)] transition-colors"
          >
            Esqueceu a senha?
          </a>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full font-semibold text-base"
          isLoading={isPending}
        >
          <span>Entrar no Sistema</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </FormProvider>
  );
}

