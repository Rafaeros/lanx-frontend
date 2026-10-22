// --- Cadastros: Rateios ---
export interface RateioResponse {
  id: string;
  nome: string;
}

/** Corpo de POST e PUT em /rateios. */
export interface RateioRequest {
  nome: string;
}

export interface RateioFilter {
  busca?: string;
}
