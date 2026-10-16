import type { NavigationNode } from "@/shared/types";
import { findNavigationNode, hasNavigationAction } from "@/features/auth/lib/navigation-tree";
import type { ModuleDefinition, NavItem, NavSection } from "../types";

/** Item visível quando não exige funcionalidade ou o backend concede "read" nela. */
export function canSeeItem(item: NavItem, navigation: NavigationNode[]): boolean {
  return !item.featureKey || hasNavigationAction(navigation, item.featureKey, "read");
}

/** Módulo visível quando não exige funcionalidade ou ela aparece na árvore do usuário. */
export function canSeeModule(module: ModuleDefinition, navigation: NavigationNode[]): boolean {
  return !module.featureKey || !!findNavigationNode(navigation, module.featureKey);
}

export function filterSection(section: NavSection, navigation: NavigationNode[]): NavSection {
  return { ...section, items: section.items.filter((item) => canSeeItem(item, navigation)) };
}
