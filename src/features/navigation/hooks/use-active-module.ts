import * as React from "react";
import { useLocation } from "react-router";
import { DEFAULT_MODULE_ID } from "../config/modules";
import { findModuleByPath } from "../lib/resolve";
import type { ModuleDefinition, ModuleId } from "../types";

const STORAGE_KEY = "lanx-active-module";

function readStoredModule(): ModuleId | null {
  try {
    return localStorage.getItem(STORAGE_KEY) as ModuleId | null;
  } catch {
    return null;
  }
}

function storeModule(id: ModuleId) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Sem armazenamento: a escolha vale só até recarregar a página
  }
}

/**
 * Módulo ativo na sidebar. A rota manda (abrir /compras/... ativa Compras);
 * fora disso vale a última escolha do usuário no seletor de módulos.
 */
export function useActiveModule(visibleModules: ModuleDefinition[]) {
  const { pathname } = useLocation();
  const routeModuleId = findModuleByPath(pathname)?.id;
  const [selectedId, setSelectedId] = React.useState<ModuleId>(
    () => routeModuleId ?? readStoredModule() ?? DEFAULT_MODULE_ID
  );

  React.useEffect(() => {
    if (routeModuleId) setSelectedId(routeModuleId);
  }, [routeModuleId]);

  const selectModule = React.useCallback((id: ModuleId) => {
    setSelectedId(id);
    storeModule(id);
  }, []);

  const activeModule =
    visibleModules.find((m) => m.id === selectedId) ??
    visibleModules.find((m) => m.id === DEFAULT_MODULE_ID) ??
    visibleModules[0];

  return { activeModule, selectModule };
}
