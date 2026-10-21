// --- Administração: Usuários, Perfis e Permissões ---
export interface RoleResponse {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
}

/** Corpo de POST e PUT em /auth/roles. `permissions` são códigos "feature:action". */
export interface RoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface PermissionItem {
  code: string;
  action: string;
}

/** Nó do catálogo (GET /auth/features): o que pode ser concedido às roles. */
export interface FeatureNode {
  key: string;
  label: string;
  permissions: PermissionItem[];
  children: FeatureNode[];
}

export interface RegisterUserRequest {
  username: string;
  password: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  roleIds: string[];
  active: boolean;
}
