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
