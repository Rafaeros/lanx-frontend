import { Link } from "react-router";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Package,
  FileSpreadsheet,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { tokenStorage } from "@/shared/api/client";

export function meta() {
  return [
    { title: "LANX - Plataforma de Gestão Industrial & Suprimentos" },
    {
      name: "description",
      content:
        "Sistema de gestão corporativa integrada para compras, cadastros e controle de materiais.",
    },
  ];
}

export default function Home() {
  const isAuthenticated = typeof window !== "undefined" && !!tokenStorage.get();

  return (
    <div className="min-h-screen bg-[var(--background)] bg-grid flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[var(--brand-purple)] to-[var(--brand-blue)] flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-blue)] bg-clip-text text-transparent">
              LANX
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to={isAuthenticated ? "/cadastros/materiais" : "/login"}>
              <Button variant="gradient" size="sm" className="gap-2">
                <span>{isAuthenticated ? "Ir para o Painel" : "Acessar Sistema"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-purple)]/20 bg-[var(--brand-purple)]/10 text-xs font-semibold text-[var(--brand-purple)] mb-8 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Nova Versão do Portal Corporativo LANX</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--foreground)] leading-tight sm:leading-tight">
          Gestão Inteligente de{" "}
          <span className="bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-blue)] bg-clip-text text-transparent">
            Suprimentos & Materiais
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-3xl font-normal leading-relaxed">
          Plataforma corporativa moderna e segura com controle granular de acesso,
          análise analítica de pedidos de compras, normalização de unidades de medida
          e rastreabilidade completa.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link to={isAuthenticated ? "/cadastros/materiais" : "/login"}>
            <Button variant="gradient" size="lg" className="w-full sm:w-auto text-base px-8 h-12 gap-2 shadow-lg">
              <span>{isAuthenticated ? "Acessar o Painel" : "Fazer Login"}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/cadastros/materiais">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-12">
              Explorar Catálogo
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] flex items-center justify-center mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
              Catálogo de Materiais
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Cadastro estruturado com validação de duplicidade por código, unidades de medida normalizadas e pesquisa rápida paginada.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
              Análise de Compras
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Painel com métricas de lead time, acompanhamento de requisições, pedidos de compras, fornecedores e cumprimento de saldo.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
              Segurança RBAC Granular
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Sidebar e ações condicionais dinâmicas, integradas à árvore de navegação e permissões do LANX Backend.
            </p>
          </div>
        </div>

        {/* System Benefits Checklist */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>React Router v7 Framework</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>TanStack Query Caching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Tailwind CSS v4 Design Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>JWT + RBAC Navigation</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--card-border)] bg-[var(--card-bg)] py-6 text-center text-xs text-[var(--muted-foreground)]">
        <p>© 2026 LANX Enterprise Solutions. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
