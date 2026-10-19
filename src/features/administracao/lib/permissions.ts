import type { FeatureNode, RoleResponse } from "@/shared/api/schema";

type PermissionItem = FeatureNode["permissions"][number];

/** Ações CRUD, na ordem em que aparecem como colunas da matriz de permissões. */
export const CRUD_ACTIONS = ["read", "create", "update", "delete"] as const;
export type CrudAction = (typeof CRUD_ACTIONS)[number];

const ACTION_LABELS: Record<string, string> = {
  read: "Visualizar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
  importar: "Importar",
  exportar: "Exportar",
};

export function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, " ");
}

export function isCrudAction(action: string): action is CrudAction {
  return (CRUD_ACTIONS as readonly string[]).includes(action);
}

/** Separa as permissões de uma funcionalidade em colunas CRUD e ações específicas (importar, exportar…). */
export function splitPermissions(node: FeatureNode): {
  crud: Partial<Record<CrudAction, PermissionItem>>;
  extras: PermissionItem[];
} {
  const crud: Partial<Record<CrudAction, PermissionItem>> = {};
  const extras: PermissionItem[] = [];
  for (const permission of node.permissions) {
    if (isCrudAction(permission.action)) crud[permission.action] = permission;
    else extras.push(permission);
  }
  return { crud, extras };
}

/** Todos os códigos de permissão de um nó e de seus filhos. */
export function collectCodes(node: FeatureNode): string[] {
  return [...node.permissions.map((p) => p.code), ...node.children.flatMap(collectCodes)];
}

/** Códigos de uma ação específica em um nó e em seus filhos (para marcar uma coluna inteira). */
export function collectCodesByAction(node: FeatureNode, action: string): string[] {
  return [
    ...node.permissions.filter((p) => p.action === action).map((p) => p.code),
    ...node.children.flatMap((child) => collectCodesByAction(child, action)),
  ];
}

/** Normaliza texto para busca: minúsculas e sem acentos. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Role ADMIN: o backend a recria com todas as permissões a cada subida, então não é editável. */
export const SYSTEM_ROLE_NAME = "ADMIN";

export function isSystemRole(role: Pick<RoleResponse, "name">): boolean {
  return role.name === SYSTEM_ROLE_NAME;
}
