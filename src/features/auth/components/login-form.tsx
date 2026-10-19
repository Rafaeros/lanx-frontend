import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas";
import { useLogin } from "../api/use-login";
import { FormInput } from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";
import { Lock, User, AlertCircle } from "lucide-react";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { firstAccessStore } from "../lib/first-access";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/app";

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
      onSuccess: (response) => {
        if (response.firstAccess) {
          // senha provisória: define a própria antes de entrar (credencial só em memória)
          firstAccessStore.set({ username: data.username, password: data.password, redirect: redirectUrl });
          navigate("/primeiro-acesso", { replace: true });
          return;
        }
        navigate(redirectUrl);
      },
      onError: (error) => {
        setErrorMessage(
          getApiErrorMessage(error, "Usuário ou senha incorretos. Confira os dados e tente novamente.")
        );
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3.5 text-sm text-danger">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <FormInput
          name="username"
          label="Usuário"
          placeholder="seu.usuario"
          autoComplete="username"
          required
          leftIcon={<User className="h-4 w-4" />}
        />

        <FormInput
          name="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full font-semibold"
          isLoading={isPending}
        >
          Entrar
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Esqueceu a senha? Peça ao administrador do sistema para redefini-la.
        </p>
      </form>
    </FormProvider>
  );
}

