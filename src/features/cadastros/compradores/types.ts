// --- Cadastros: Compradores ---
export interface UsuarioSummaryResponse {
  id: string;
  username: string;
}

export interface CompradorResponse {
  id: string;
  /** Nome como vem do ERP. */
  nome: string;
  /** Ausente enquanto o comprador não for vinculado a um usuário do LANX. */
  usuario?: UsuarioSummaryResponse | null;
}

/** Corpo de POST e PUT em /compradores. `userId` nulo deixa (ou volta) o comprador sem usuário. */
export interface CompradorRequest {
  nome: string;
  userId: string | null;
}

export interface CompradorFilter {
  busca?: string;
}
