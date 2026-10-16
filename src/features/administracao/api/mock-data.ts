import type { FeatureNode, RoleResponse, UserResponse } from "@/shared/api/schema";

/** Dados de desenvolvimento usados só quando VITE_ENABLE_MOCK_FALLBACK está ligado. */
const crud = (key: string, extras: string[] = []) =>
  ["read", "create", "update", "delete", ...extras].map((action) => ({
    code: `${key}:${action}`,
    action,
  }));

export const MOCK_FEATURES: FeatureNode[] = [
  {
    key: "administracao",
    label: "Administração",
    permissions: crud("administracao"),
    children: [
      { key: "administracao.usuarios", label: "Usuários", permissions: crud("administracao.usuarios"), children: [] },
      { key: "administracao.permissoes", label: "Perfis e Permissões", permissions: crud("administracao.permissoes"), children: [] },
    ],
  },
  {
    key: "cadastros",
    label: "Cadastros",
    permissions: crud("cadastros"),
    children: [
      { key: "cadastros.unidade-medida", label: "Unidades de Medida", permissions: crud("cadastros.unidade-medida"), children: [] },
      { key: "cadastros.materiais", label: "Materiais", permissions: crud("cadastros.materiais"), children: [] },
    ],
  },
  {
    key: "compras",
    label: "Compras",
    permissions: crud("compras"),
    children: [
      {
        key: "compras.analise-pedidos",
        label: "Análise de Pedidos",
        permissions: crud("compras.analise-pedidos", ["importar"]),
        children: [],
      },
    ],
  },
];

const allCodes = (nodes: FeatureNode[]): string[] =>
  nodes.flatMap((n) => [...n.permissions.map((p) => p.code), ...allCodes(n.children)]);

export const mockStore: { roles: RoleResponse[]; users: UserResponse[] } = {
  roles: [
    { id: "r-admin", name: "ADMIN", description: "Acesso total ao sistema", permissions: allCodes(MOCK_FEATURES) },
    {
      id: "r-compras",
      name: "COMPRADOR",
      description: "Consulta e importa pedidos de compra",
      permissions: ["compras.analise-pedidos:read", "compras.analise-pedidos:importar", "cadastros.materiais:read"],
    },
  ],
  users: [],
};

mockStore.users = [
  { id: "u-admin", username: "admin", active: true, roles: [{ id: "r-admin", name: "ADMIN" }], permissions: [] },
  { id: "u-mariana", username: "mariana.silva", active: true, roles: [{ id: "r-compras", name: "COMPRADOR" }], permissions: [] },
  { id: "u-carlos", username: "carlos", active: false, roles: [{ id: "r-compras", name: "COMPRADOR" }], permissions: [] },
];
