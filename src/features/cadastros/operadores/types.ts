// --- Cadastros: Operadores ---
export interface DepartamentoSummaryResponse {
  id: string;
  nome: string;
}

export interface OperadorResponse {
  id: string;
  nome: string;
  /** Ausente quando o operador não tem departamento (o backend omite nulos). */
  departamento?: DepartamentoSummaryResponse | null;
}

/** Corpo de POST e PUT em /operadores. `departamentoId` nulo deixa (ou volta) o operador sem departamento. */
export interface OperadorRequest {
  nome: string;
  departamentoId: string | null;
}

export interface OperadorFilter {
  busca?: string;
}
