// --- Cadastros: Clientes ---
export interface ClienteResponse {
  id: string;
  nome: string;
  /** Só os 14 dígitos; ausente quando o cliente não tem CNPJ. */
  cnpj?: string | null;
}

/** Corpo de POST e PUT em /clientes. `cnpj` nulo = cliente sem CNPJ. */
export interface ClienteRequest {
  nome: string;
  cnpj: string | null;
}

export interface ClienteFilter {
  busca?: string;
}
