import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import type { LoginRequest, LoginResponse } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
    },
  });
}

