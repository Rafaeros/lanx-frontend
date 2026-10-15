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

export interface UnidadeMedidaResponse {
  id: string;
  nome: string;
  sigla: string;
  descricao?: string;
}

export interface CreateUnidadeMedidaRequest {
  nome: string;
  sigla: string;
  descricao?: string;
}

export interface UpdateUnidadeMedidaRequest {
  nome: string;
  sigla: string;
  descricao?: string;
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
  leadTimeDias?: number;
  atendimentoParcial?: boolean;
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

export interface ImportarAnalisePedidoRequest {
  dataInicio?: string;
  dataFim?: string;
}

export interface ImportarAnalisePedidoResponse {
  itensImportados: number;
}

