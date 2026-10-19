import * as React from "react";
import { Link, Navigate } from "react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { FirstAccessForm } from "@/features/auth";
import { firstAccessStore } from "@/features/auth/lib/first-access";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { BrandLogo } from "@/shared/components/ui/brand-logo";

export function meta() {
  return [
    { title: "Primeiro acesso - LANX" },
    { name: "description", content: "Defina a sua senha de acesso ao LANX" },
  ];
}

/** Rota pública: só chega aqui quem acabou de entrar com a senha provisória. */
export default function PrimeiroAcessoPage() {
  // a credencial provisória vive só em memória: sem ela (recarregou, link direto), volta ao login
  const [pending] = React.useState(() => firstAccessStore.get());
  if (!pending) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-background bg-grid p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/login"
          onClick={() => firstAccessStore.clear()}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto my-auto w-full max-w-md py-10">
        <BrandLogo size="lg" className="mb-8" />
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Primeiro acesso</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Olá, <span className="font-medium text-foreground">{pending.username}</span>. Antes de continuar,
                troque a senha provisória por uma senha só sua.
              </p>
            </div>
          </div>
          <FirstAccessForm pending={pending} />
        </div>
      </div>

      <p className="pb-2 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} LANX</p>
    </div>
  );
}
