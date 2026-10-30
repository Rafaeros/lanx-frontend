import type * as React from "react";
import type { QuickCreate, QuickCreateRenderProps } from "@/shared/components/form/quick-create";
import { useCan } from "./use-can";

/**
 * Monta o cadastro rápido de um select só para quem pode cadastrar (`permission`, ex.:
 * "cadastros.departamentos:create"); sem a permissão devolve undefined e o select fica sem o botão.
 */
export function useQuickCreate(
  permission: string,
  label: string,
  render: (props: QuickCreateRenderProps) => React.ReactNode
): QuickCreate | undefined {
  const { can } = useCan();
  return can(permission) ? { label, render } : undefined;
}
