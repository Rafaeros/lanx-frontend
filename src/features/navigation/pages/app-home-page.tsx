import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useModuleNavigation } from "../hooks/use-module-navigation";
import { useOpenModule } from "../hooks/use-open-module";
import { ModuleTile } from "../components/module-tile";

/** Tela inicial após o login: escolha de módulo + atalhos para os cadastros. */
export function AppHomePage() {
  const { user } = useCurrentUser();
  const { modules, activeModule, selectModule, cadastros } = useModuleNavigation();
  const openModule = useOpenModule(selectModule);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Olá, {user?.username ?? "bem-vindo"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Escolha um módulo para começar. Você pode trocar a qualquer momento pelo botão de módulos
          no topo da sidebar.
        </p>
      </div>

      <section aria-labelledby="modulos-title" className="space-y-3">
        <h2 id="modulos-title" className="text-sm font-semibold text-foreground">
          Módulos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleTile
              key={module.id}
              module={module}
              size="large"
              selected={module.id === activeModule?.id}
              onSelect={openModule}
            />
          ))}
        </div>
      </section>

      {cadastros.items.length > 0 && (
        <section aria-labelledby="cadastros-title" className="space-y-3">
          <h2 id="cadastros-title" className="text-sm font-semibold text-foreground">
            Cadastros
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cadastros.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
