import type { ApiResponse, PageResult, NavigationNode, UserResponse } from "../types";

export type { ApiResponse, PageResult, NavigationNode, UserResponse };

// --- Auth ---
export interface LoginRequest {
  username: string;
  password: string;
}

/** Com `firstAccess`, não há token: o usuário precisa definir a senha em /primeiro-acesso. */
export interface LoginResponse {
  accessToken?: string;
  tokenType?: string;
  expiresAt?: string;
  firstAccess: boolean;
}

/** POST /auth/first-access (público): troca a senha provisória e devolve o token. */
export interface FirstAccessRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

// --- Cadastros: Países (somente leitura, carregados pelo seeder) ---
export interface PaisResponse {
  id: string;
  nome: string;
  codigoIso2: string;
  codigoIso3: string;
}

export interface PaisSummaryResponse {
  id: string;
  nome: string;
  codigoIso2: string;
}

// --- Cadastros: Fornecedores ---
export interface FornecedorResponse {
  id: string;
  nome: string;
  /** Ausente quando o fornecedor não tem país (o backend omite nulos). */
  pais?: PaisSummaryResponse | null;
}

/** Corpo de POST e PUT em /fornecedores. `paisId` nulo deixa (ou volta) o fornecedor sem país. */
export interface FornecedorRequest {
  nome: string;
  paisId: string | null;
}

export type CreateFornecedorRequest = FornecedorRequest;
export type UpdateFornecedorRequest = FornecedorRequest;

export interface FornecedorFilter {
  busca?: string;
}

// --- Compras: Análise de Pedidos ---
/** Fornecedor normalizado em cadastros.fornecedores. */
export interface AnaliseFornecedorResumo {
  id: string;
  nome: string;
  pais?: string | null;
}

/** Material normalizado em cadastros.materiais. */
export interface AnaliseMaterialResumo {
  id: string;
  codigo: string;
  descricao: string;
}

/** Unidade de medida normalizada em cadastros.unidades_medida. */
export interface AnaliseUnidadeMedidaResumo {
  id: string;
  sigla: string;
}

export interface AnalisePedidoResponse {
  id?: string;
  requisicaoDeCompra?: string;
  solicitante?: string;
  dataEmissaoRc?: string;
  dataPrevisaoEntregaRc?: string;
  pedidoDeCompra?: string;
  comprador?: string;
  dataEmissaoPc?: string;
  dataPrevisaoEntregaPc?: string;
  dataEntregaPc?: string;
  /** Ausente quando o item veio do ERP sem fornecedor. */
  fornecedor?: AnaliseFornecedorResumo | null;
  material?: AnaliseMaterialResumo;
  unidadeMedida?: AnaliseUnidadeMedidaResumo;
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

// --- Compras: IQF (Índice de Qualidade de Fornecedores, critério prazo) ---
export type FaixaIqf = "A" | "B" | "C";

/** A/VERDE (>= 84%), B/AMARELO (>= 75%), C/VERMELHO. */
export interface ClassificacaoIqfResponse {
  faixa: FaixaIqf;
  cor: "VERDE" | "AMARELO" | "VERMELHO";
}

/** `percentualNoPrazo` e `classificacao` vêm ausentes quando não há entregas avaliadas. */
export interface IqfFornecedorResponse {
  fornecedorId: string;
  fornecedor: string;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  /** Percentual >= meta por fornecedor (85%); ausente quando nada foi avaliado. */
  atingiuMeta?: boolean | null;
}

/** IQF de um mês ("2026-09"). Sem entregas avaliadas, percentual e classificação vêm ausentes. */
export interface IqfMesResponse {
  mes: string;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  /** Percentual >= meta mensal (97%); ausente quando nada foi avaliado. */
  atingiuMeta?: boolean | null;
}

/** Filtros do IQF: período da previsão de entrega + rateios (vazio = todos) + tolerância de atraso. */
export interface IqfFiltro {
  dataInicio: string;
  dataFim: string;
  rateios: string[];
  /** Dias após a previsão que ainda contam como no prazo (0 a 30; padrão 1). */
  toleranciaDias: number;
}

/** GET /compras/relatorios/iqf: período pela previsão de entrega do PC. `meses` traz todo mês do período. */
export interface IqfResponse {
  dataInicio: string;
  dataFim: string;
  rateios: string[];
  toleranciaDias: number;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  fornecedores: IqfFornecedorResponse[];
  meses: IqfMesResponse[];
  /** Meta dos meses: 97 no IQF geral, 85 na consulta de um fornecedor. */
  metaMensal: number;
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
