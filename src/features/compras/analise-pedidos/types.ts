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

/** Comprador normalizado em cadastros.compradores. */
export interface AnaliseCompradorResumo {
  id: string;
  nome: string;
}

/** Rateio normalizado em cadastros.rateios. */
export interface AnaliseRateioResumo {
  id: string;
  nome: string;
}

export interface AnalisePedidoResponse {
  id?: string;
  requisicaoDeCompra?: string;
  solicitante?: string;
  dataEmissaoRc?: string;
  dataPrevisaoEntregaRc?: string;
  pedidoDeCompra?: string;
  /** Ausente quando o item veio do ERP sem comprador. */
  comprador?: AnaliseCompradorResumo | null;
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
  /** Ausente quando o item veio do ERP sem rateio. */
  rateio?: AnaliseRateioResumo | null;
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
  /** Ids dos rateios (cadastros.rateios); vazio = todos. */
  rateios?: string[];
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
