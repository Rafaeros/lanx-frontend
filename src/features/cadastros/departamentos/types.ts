// --- Cadastros: Departamentos ---
export interface DepartamentoResponse {
  id: string;
  nome: string;
}

/** Corpo de POST e PUT em /departamentos. */
export interface DepartamentoRequest {
  nome: string;
}

export interface DepartamentoFilter {
  busca?: string;
}
