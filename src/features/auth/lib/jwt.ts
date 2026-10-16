export interface JwtPayload {
  sub?: string;
  username?: string;
  exp?: number;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Token com `exp` no passado. Tokens sem `exp` (ex.: mock de desenvolvimento) não expiram aqui. */
export function isTokenExpired(token: string): boolean {
  const exp = decodeJwtPayload(token)?.exp;
  return typeof exp === "number" && exp * 1000 <= Date.now();
}

/** Há um token salvo e ainda válido? (Leitura síncrona, útil fora do layout autenticado.) */
export function hasStoredSession(getToken: () => string | null): boolean {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}
