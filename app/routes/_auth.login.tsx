import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { BrandLogo } from "@/shared/components/ui/brand-logo";

export function meta() {
  return [
    { title: "Entrar - LANX" },
    { name: "description", content: "Acesse sua conta no LANX" },
  ];
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background bg-grid p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto my-auto w-full max-w-sm py-10">
        <BrandLogo size="lg" className="mb-8" />
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Entrar</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Use o usuário e a senha fornecidos pelo administrador.
          </p>
          <LoginForm />
        </div>
      </div>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LANX
      </p>
    </div>
  );
}
