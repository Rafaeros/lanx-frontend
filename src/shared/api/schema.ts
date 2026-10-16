import type { ApiResponse, PageResult, NavigationNode, UserResponse } from "../types";

export type { ApiResponse, PageResult, NavigationNode, UserResponse };

// --- Auth ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

// --- Cadastros: Unidade de Medida ---
export interface UnidadeMedidaSummaryResponse {
  id: string;
  nome: string;
  sigla: string;
}

export type UnidadeMedidaResponse = UnidadeMedidaSummaryResponse;

/** Corpo de POST e PUT em /unidade-medida (o backend aceita apenas nome e sigla). */
export interface UnidadeMedidaRequest {
  nome: string;
  sigla: string;
}

export interface UnidadeMedidaFilter {
  busca?: string;
}

// --- Cadastros: Materiais ---
export interface MaterialResponse {
  id: string;
  codigo: string;
  descricao: string;
  unidadeMedida: UnidadeMedidaSummaryResponse;
}

export interface CreateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
}

export interface UpdateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
}

export interface MaterialFilter {
  codigo?: string;
  descricao?: string;
  page?: number;
  size?: number;
}

// --- Compras: Análise de Pedidos ---
export interface AnalisePedidoResponse {
  requisicaoDeCompra?: string;
  solicitante?: string;
  dataEmissaoRc?: string;
  dataPrevisaoEntregaRc?: string;
  pedidoDeCompra?: string;
  comprador?: string;
  dataEmissaoPc?: string;
  dataPrevisaoEntregaPc?: string;
  dataEntregaPc?: string;
  fornecedor?: string;
  pais?: string;
  codigoItem?: string;
  descricaoItem?: string;
  unidadeMedida?: string;
  quantidadeSolicitada?: number;
  quantidadeAtendida?: number;
  saldo?: number;
  /** Dias entre emissão do PC e entrega; null enquanto não entregue. */
  leadTimeDias?: number | null;
  atendimentoParcial?: boolean;
  situacao?: SituacaoPedido;
  local?: string;
  valorUnitario?: number;
  valorFrete?: number;
  ipi?: number;
  valorTotal?: number;
  condicaoPagamento?: string;
  ncm?: string;
  recebimento?: string;
  notaFiscal?: string;
  quantidadeRecebimentos?: number;
  rateio?: string;
  referencia?: string;
  invoice?: string;
  responsavelCompras?: string;
  observacao?: string;
}

export type SituacaoPedido = "PENDENTE" | "PARCIAL" | "ATENDIDO";

/** Filtros de GET /compras/relatorios/analise-pedidos e /resumo. */
export interface AnalisePedidosFiltro {
  dataInicio: string;
  dataFim: string;
  busca?: string;
  situacao?: SituacaoPedido | "";
}

export interface ResumoAnalisePedidosResponse {
  totalItens: number;
  valorTotal: number;
  pendentes: number;
  parciais: number;
  atendidos: number;
  leadTimeMedioDias: number | null;
}

export interface ImportarAnalisePedidoResponse {
  itensImportados: number;
}


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
