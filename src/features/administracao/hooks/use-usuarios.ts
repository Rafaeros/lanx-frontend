import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RegisterUserRequest, UpdateUserRequest } from "../types";
import { usuariosApi } from "../api/usuarios.api";

const USUARIOS_KEY = ["admin", "usuarios"];

export function useUsuariosQuery() {
  return useQuery({ queryKey: USUARIOS_KEY, queryFn: usuariosApi.list });
}

export function useCreateUsuarioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterUserRequest) => usuariosApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USUARIOS_KEY }),
  });
}

export function useUpdateUsuarioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => usuariosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_KEY });
      // se o admin editou o próprio usuário, perfil e menu mudam
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
    },
  });
}

/**
 * Usuários para os vínculos de cadastros (comprador, operador). Listar usuários exige
 * administracao.usuarios:read: sem a permissão a consulta nem dispara.
 */
export function useUsuariosParaVinculoQuery(enabled: boolean) {
  return useQuery({ queryKey: [...USUARIOS_KEY, "vinculo"], queryFn: usuariosApi.list, enabled, staleTime: 60_000 });
}
