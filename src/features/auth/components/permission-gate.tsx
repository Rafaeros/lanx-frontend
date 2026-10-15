import * as React from "react";
import { useCan } from "../hooks/use-can";

export interface PermissionGateProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Renderiza os filhos apenas se o usuário tiver a permissão necessária.
 * Exemplo: <PermissionGate permission="cadastros.materiais:create"> <Button>Novo</Button> </PermissionGate>
 */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can } = useCan();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

