// --- Auth ---
export interface LoginRequest {
  username: string;
  password: string;
}

/** Com `firstAccess`, não há token: o usuário precisa definir a senha em /primeiro-acesso. */
export interface LoginResponse {
  accessToken?: string;
  tokenType?: string;
  expiresAt?: string;
  firstAccess: boolean;
}

/** POST /auth/first-access (público): troca a senha provisória e devolve o token. */
export interface FirstAccessRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
