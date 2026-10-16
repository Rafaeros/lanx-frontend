import type { FeatureNode, RoleResponse } from "@/shared/api/schema";

const ACTION_LABELS: Record<string, string> = {
  read: "Visualizar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
  importar: "Importar",
};

export function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, " ");
}

/** Todos os códigos de permissão de um nó e de seus filhos. */
export function collectCodes(node: FeatureNode): string[] {
  return [...node.permissions.map((p) => p.code), ...node.children.flatMap(collectCodes)];
}

/** Role ADMIN: o backend a recria com todas as permissões a cada subida, então não é editável. */
export const SYSTEM_ROLE_NAME = "ADMIN";

export function isSystemRole(role: Pick<RoleResponse, "name">): boolean {
  return role.name === SYSTEM_ROLE_NAME;
}
