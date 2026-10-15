import { LoginForm } from "@/features/auth";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { Link } from "react-router";
import { ArrowLeft, Shield } from "lucide-react";

export function meta() {
  return [
    { title: "Entrar - LANX Sistema de Gestão" },
    { name: "description", content: "Acesse sua conta no portal LANX" },
  ];
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] bg-grid flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao início</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-xl shadow-purple-500/5">
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[var(--brand-purple)] to-[var(--brand-blue)] flex items-center justify-center text-white font-extrabold text-2xl shadow-md mb-3">
              L
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Portal Corporativo
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Insira suas credenciais corporativas para acessar
            </p>
          </div>

          {/* Form from auth feature */}
          <LoginForm />

          <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Shield className="h-4 w-4 text-[var(--brand-purple)]" />
            <span>Autenticação Segura JWT & RBAC</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[var(--muted-foreground)] pb-2">
        © 2026 LANX Enterprise Solutions • Todos os direitos reservados
      </div>
    </div>
  );
}

