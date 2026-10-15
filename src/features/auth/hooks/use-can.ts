import { useMemo } from "react";
import { useCurrentUser } from "./use-current-user";
import type { NavigationNode } from "@/shared/types";

/**
 * Busca recursivamente um nó de funcionalidade na árvore de navegação
 */
function findNode(nodes: NavigationNode[], key: string): NavigationNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const found = findNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

export function useCan() {
  const { user, navigation } = useCurrentUser();

  const permissionsSet = useMemo(() => {
    return new Set(user?.permissions || []);
  }, [user]);

  /**
   * Verifica se o usuário tem a permissão direta (ex: "cadastros.materiais:create")
   */
  const can = (permissionCode: string): boolean => {
    if (!user) return false;
    // Se o usuário tem a permissão direta
    if (permissionsSet.has(permissionCode)) return true;

    // Se a permissão for verificada no formato feature:action
    const [feature, action] = permissionCode.split(":");
    if (feature && action) {
      const node = findNode(navigation, feature);
      if (node && node.actions?.includes(action)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Verifica se o usuário pode executar uma ação em uma feature específica
   */
  const canAction = (featureKey: string, action: string): boolean => {
    return can(`${featureKey}:${action}`);
  };

  /**
   * Verifica se o usuário tem acesso à funcionalidade (módulo ou submódulo)
   */
  const hasFeature = (featureKey: string): boolean => {
    const node = findNode(navigation, featureKey);
    return !!node;
  };

  return {
    can,
    canAction,
    hasFeature,
  };
}

