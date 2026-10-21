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
