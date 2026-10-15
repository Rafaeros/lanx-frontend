import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "@/shared/api/client";
import { useNavigate } from "react-router";
import { useCallback } from "react";

export function useCurrentUser() {
  const token = typeof window !== "undefined" ? tokenStorage.get() : null;
  const navigate = useNavigate();

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
    navigate("/login");
  }, [navigate]);

  return {
    user: userQuery.data ?? null,
    navigation: navigationQuery.data ?? [],
    isAuthenticated: !!token,
    isLoading: userQuery.isLoading || navigationQuery.isLoading,
    logout,
  };
}

