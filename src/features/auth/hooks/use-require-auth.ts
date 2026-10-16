import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCurrentUser } from "./use-current-user";

/** Redireciona para o login quando não há sessão válida, preservando a rota de retorno. */
export function useRequireAuth() {
  const session = useCurrentUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(pathname)}`, { replace: true });
    }
  }, [session.isAuthenticated, navigate, pathname]);

  return session;
}
