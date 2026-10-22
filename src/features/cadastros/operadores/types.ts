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
  /** Ausente enquanto o operador não for vinculado a um usuário do LANX. */
  usuario?: UsuarioSummaryResponse | null;
}

export interface UsuarioSummaryResponse {
  id: string;
  username: string;
}

/**
 * Corpo de POST e PUT em /operadores. `departamentoId`/`userId` nulos deixam (ou voltam) o operador
 * sem departamento/usuário. Um usuário pode ser de no máximo um operador (409 se já for).
 */
export interface OperadorRequest {
  nome: string;
  departamentoId: string | null;
  userId: string | null;
}

export interface OperadorFilter {
  busca?: string;
}
