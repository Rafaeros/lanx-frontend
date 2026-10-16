import type { NavigationNode } from "@/shared/types";

/** Busca recursivamente um nó de funcionalidade na árvore de navegação devolvida pelo backend. */
export function findNavigationNode(nodes: NavigationNode[], key: string): NavigationNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const found = findNavigationNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

/** O usuário pode executar `action` na funcionalidade `key`? */
export function hasNavigationAction(nodes: NavigationNode[], key: string, action: string): boolean {
  return findNavigationNode(nodes, key)?.actions?.includes(action) ?? false;
}
