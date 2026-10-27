import * as React from "react";
import { Link } from "react-router";
import { ArrowUpRight, CalendarDays, ChevronRight, Database, LayoutGrid, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useModuleNavigation } from "../hooks/use-module-navigation";
import { useOpenModule } from "../hooks/use-open-module";
import { filterSection } from "../lib/access";
import { moduleAccentVar } from "../config/modules";
import { ModuleIcon } from "../components/module-icon";
import type { ModuleDefinition, NavItem } from "../types";

function saudacao(hora: number): string {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

const dataLonga = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });

/** Tela inicial após o login: visão geral do acesso do usuário e atalhos para todas as telas liberadas. */
export function AppHomePage() {
  const { user, navigation } = useCurrentUser();
  const { modules, selectModule, todosCadastros: cadastros } = useModuleNavigation();
  const openModule = useOpenModule(selectModule);

  const agora = new Date();
  const roles = user?.roles ?? [];

  // Telas liberadas por módulo, já filtradas pelas permissões do usuário
  const disponiveis = React.useMemo(
    () =>
      modules
        .filter((module) => module.status === "available")
        .map((module) => ({
          module,
          items: module.sections
            .flatMap((section) => filterSection(section, navigation).items)
            .filter((item) => item.status !== "soon"),
        }))
        .filter((entry) => entry.items.length > 0),
    [modules, navigation]
  );
  const emBreve = modules.filter((module) => module.status === "soon");
  const totalTelas = disponiveis.reduce((total, entry) => total + entry.items.length, 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-4">
      {/* Boas-vindas */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div aria-hidden="true" className="absolute inset-0 bg-brand-gradient-soft" />
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="inline-block first-letter:uppercase">{dataLonga.format(agora)}</span>
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {saudacao(agora.getHours())},{" "}
              <span className="text-brand-gradient">{user?.username ?? "bem-vindo"}</span>
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Este é o seu painel de acesso ao LANX. Abra uma tela pelos atalhos abaixo ou troque de
              módulo a qualquer momento pelo seletor no topo da barra lateral.
            </p>
            {roles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                {roles.map((role) => (
                  <span
                    key={role.id}
                    className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <dl className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">
            <Stat icon={LayoutGrid} label="Módulos" value={disponiveis.length} />
            <Stat icon={ArrowUpRight} label="Telas" value={totalTelas} />
            <Stat icon={Database} label="Cadastros" value={cadastros.items.length} />
          </dl>
        </div>
      </section>

      {/* Atalhos por módulo */}
      {disponiveis.length > 0 && (
        <section aria-labelledby="acesso-title" className="space-y-3">
          <SectionTitle id="acesso-title" title="Acesso rápido" hint="Telas liberadas para o seu perfil" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {disponiveis.map(({ module, items }) => (
              <ModuleCard
                key={module.id}
                module={module}
                items={items}
                onOpen={() => openModule(module)}
                onItem={() => selectModule(module.id)}
              />
            ))}
          </div>
        </section>
      )}

      {cadastros.items.length > 0 && (
        <section aria-labelledby="cadastros-title" className="space-y-3">
          <SectionTitle id="cadastros-title" title="Cadastros" hint="Dados mestres usados pelos módulos" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cadastros.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors duration-200 hover:border-primary/30 hover:bg-muted"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 truncate text-sm font-semibold text-foreground">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {emBreve.length > 0 && (
        <section aria-labelledby="em-breve-title" className="space-y-3">
          <SectionTitle id="em-breve-title" title="Em breve" hint="Módulos em desenvolvimento" />
          <div className="flex flex-wrap gap-2">
            {emBreve.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => openModule(module)}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-border bg-card/60 py-2 pl-2 pr-4 text-left transition-colors duration-200 hover:bg-muted"
              >
                <ModuleIcon module={module} size="sm" />
                <span>
                  <span className="block text-sm font-semibold text-foreground">{module.label}</span>
                  <span className="block text-xs text-muted-foreground">{module.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="min-w-[5.5rem] rounded-xl border border-border bg-card/80 px-3 py-2.5 backdrop-blur-sm sm:min-w-28 sm:px-4">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function SectionTitle({ id, title, hint }: { id: string; title: string; hint: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 id={id} className="font-display text-base font-semibold text-foreground">
        {title}
      </h2>
      <p className="hidden text-xs text-muted-foreground sm:block">{hint}</p>
    </div>
  );
}

function ModuleCard({
  module,
  items,
  onOpen,
  onItem,
}: {
  module: ModuleDefinition;
  items: NavItem[];
  onOpen: () => void;
  onItem: () => void;
}) {
  return (
    <article
      style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group flex cursor-pointer items-start gap-3 border-b border-border p-4 text-left transition-colors duration-200 hover:bg-muted/60"
      >
        <ModuleIcon module={module} size="lg" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-foreground">{module.label}</span>
          <span className="block text-sm text-muted-foreground">{module.description}</span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
      </button>

      <ul className="flex-1 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <Link
                to={item.to}
                onClick={onItem}
                className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              >
                <Icon className="accent-text h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
