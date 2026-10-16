import { useMemo } from "react";
import { useCurrentUser } from "./use-current-user";
import { findNavigationNode, hasNavigationAction } from "../lib/navigation-tree";

/**
 * Checagem de permissões no formato "feature:action".
 * Fonte de verdade: a árvore /auth/me/navigation (disponível para qualquer usuário autenticado).
 * `user.permissions` complementa quando /auth/users/{id} pôde ser lido (exige administracao.usuarios:read).
 */
export function useCan() {
  const { user, navigation } = useCurrentUser();

  const permissionsSet = useMemo(() => new Set(user?.permissions || []), [user]);

  const can = (permissionCode: string): boolean => {
    if (permissionsSet.has(permissionCode)) return true;
    const [feature, action] = permissionCode.split(":");
    return !!feature && !!action && hasNavigationAction(navigation, feature, action);
  };

  const canAction = (featureKey: string, action: string): boolean => can(`${featureKey}:${action}`);

  const hasFeature = (featureKey: string): boolean => !!findNavigationNode(navigation, featureKey);

  return { can, canAction, hasFeature };
}
