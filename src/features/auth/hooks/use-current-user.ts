import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "@/shared/api/client";
import { isTokenExpired } from "../lib/jwt";
import { useNavigate } from "react-router";
import { useCallback } from "react";

function readValidToken(): string | null {
  const token = tokenStorage.get();
  if (token && isTokenExpired(token)) {
    tokenStorage.remove();
    return null;
  }
  return token;
}

export function useCurrentUser() {
  const token = typeof window !== "undefined" ? readValidToken() : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["currentUser", token],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
  });

  const navigationQuery = useQuery({
    queryKey: ["navigation", token],
    queryFn: authApi.getNavigation,
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
  });

  const logout = useCallback(() => {
    authApi.logout();
    queryClient.clear();
    navigate("/login");
  }, [navigate, queryClient]);

  return {
    user: userQuery.data ?? null,
    navigation: navigationQuery.data ?? [],
    isAuthenticated: !!token,
    isLoading: userQuery.isLoading || navigationQuery.isLoading,
    navigationError: navigationQuery.error,
    logout,
  };
}
