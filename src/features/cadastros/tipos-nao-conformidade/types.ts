// --- Cadastros: Tipos de não conformidade ---
export interface TipoNaoConformidadeResponse {
  id: string;
  nome: string;
}

/** Corpo de POST e PUT em /tipos-nao-conformidade. */
export interface TipoNaoConformidadeRequest {
  nome: string;
}

export interface TipoNaoConformidadeFilter {
  busca?: string;
}
