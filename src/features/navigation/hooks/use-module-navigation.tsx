import * as React from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { MODULES } from "../config/modules";
import { CADASTROS, cadastrosDoModulo } from "../config/cadastros";
import { SECTION_ORDER } from "../config/sections";
import { canSeeModule, filterSection } from "../lib/access";
import type { ModuleDefinition, ModuleId, NavSection } from "../types";
import { useActiveModule } from "./use-active-module";

interface ModuleNavigationValue {
  modules: ModuleDefinition[];
  activeModule: ModuleDefinition | undefined;
  selectModule: (id: ModuleId) => void;
  /** Cadastros do módulo ativo (os que ele declara e o usuário pode ver). */
  cadastros: NavSection;
  /** Todos os cadastros que o usuário pode ver, de qualquer módulo (tela inicial). */
  todosCadastros: NavSection;
  sections: NavSection[];
  isLoading: boolean;
}

const ModuleNavigationContext = React.createContext<ModuleNavigationValue | undefined>(undefined);

/**
 * Cruza o registro de módulos com as permissões do backend e compartilha com a sidebar e as
 * telas: módulos visíveis, módulo ativo, Cadastros do módulo ativo e as demais seções dele.
 */
export function ModuleNavigationProvider({ children }: { children: React.ReactNode }) {
  const { navigation, isLoading } = useCurrentUser();

  const modules = React.useMemo(
    () => MODULES.filter((module) => canSeeModule(module, navigation)),
    [navigation]
  );

  const { activeModule, selectModule } = useActiveModule(modules);

  const cadastros = React.useMemo(
    () => filterSection(cadastrosDoModulo(activeModule?.cadastros), navigation),
    [activeModule, navigation]
  );

  const todosCadastros = React.useMemo(
    () => filterSection({ kind: "cadastros", items: CADASTROS }, navigation),
    [navigation]
  );

  const sections = React.useMemo(
    () =>
      (activeModule?.sections ?? [])
        .map((section) => filterSection(section, navigation))
        .filter((section) => section.items.length > 0)
        .sort((a, b) => SECTION_ORDER.indexOf(a.kind) - SECTION_ORDER.indexOf(b.kind)),
    [activeModule, navigation]
  );

  const value = React.useMemo(
    () => ({ modules, activeModule, selectModule, cadastros, todosCadastros, sections, isLoading }),
    [modules, activeModule, selectModule, cadastros, todosCadastros, sections, isLoading]
  );

  return (
    <ModuleNavigationContext.Provider value={value}>{children}</ModuleNavigationContext.Provider>
  );
}

export function useModuleNavigation(): ModuleNavigationValue {
  const context = React.useContext(ModuleNavigationContext);
  if (!context) {
    throw new Error("useModuleNavigation deve ser usado dentro de um ModuleNavigationProvider");
  }
  return context;
}
