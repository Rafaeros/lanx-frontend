import { MODULES } from "../config/modules";
import { SHARED_CADASTROS } from "../config/cadastros";
import type { ModuleDefinition, NavItem } from "../types";

export function matchesPath(item: NavItem, pathname: string): boolean {
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/** Módulo dono da rota atual. Rotas de Cadastros são compartilhadas, então não definem módulo. */
export function findModuleByPath(pathname: string): ModuleDefinition | undefined {
  return MODULES.find((module) =>
    module.sections.some((section) => section.items.some((item) => matchesPath(item, pathname)))
  );
}

export function findItemByPath(pathname: string): NavItem | undefined {
  const allItems = [
    ...SHARED_CADASTROS.items,
    ...MODULES.flatMap((m) => m.sections.flatMap((s) => s.items)),
  ];
  return allItems.find((item) => matchesPath(item, pathname));
}

export function isCadastroPath(pathname: string): boolean {
  return SHARED_CADASTROS.items.some((item) => matchesPath(item, pathname));
}
