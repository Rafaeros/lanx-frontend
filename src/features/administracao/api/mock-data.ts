import type { FeatureNode, RoleResponse, UserResponse } from "@/shared/api/schema";

/** Dados de desenvolvimento usados só quando VITE_ENABLE_MOCK_FALLBACK está ligado. */
const perms = (key: string, actions: string[]) => actions.map((action) => ({ code: `${key}:${action}`, action }));

/** Cadastros/admin e módulos raiz: CRUD completo. */
const crud = (key: string) => perms(key, ["read", "create", "update", "delete"]);

/** Relatórios: somente leitura + ações específicas (importar, exportar…). */
const report = (key: string, extras: string[]) => perms(key, ["read", ...extras]);

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
      { key: "cadastros.fornecedores", label: "Fornecedores", permissions: crud("cadastros.fornecedores"), children: [] },
      { key: "cadastros.pais", label: "Países", permissions: crud("cadastros.pais"), children: [] },
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
        permissions: report("compras.analise-pedidos", ["exportar", "importar"]),
        children: [],
      },
      { key: "compras.iqf", label: "IQF de Fornecedores", permissions: report("compras.iqf", ["exportar"]), children: [] },
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
