import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { compradoresApi } from "../api/compradores.api";
import { usuariosApi } from "@/features/administracao/api/usuarios.api";
import type { CompradorFilter, CompradorRequest } from "../types";

const COMPRADORES_KEY = "compradores";

export function useCompradoresSearchQuery(filter: CompradorFilter, page: number, size: number) {
  return useQuery({
    queryKey: [COMPRADORES_KEY, "search", filter, page, size],
    queryFn: () => compradoresApi.search(filter, page, size),
  });
}

function useInvalidateCompradores() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [COMPRADORES_KEY] });
  };
}

export function useCreateCompradorMutation() {
  const invalidate = useInvalidateCompradores();
  return useMutation({
    mutationFn: (data: CompradorRequest) => compradoresApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateCompradorMutation() {
  const invalidate = useInvalidateCompradores();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompradorRequest }) => compradoresApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteCompradorMutation() {
  const invalidate = useInvalidateCompradores();
  return useMutation({
    mutationFn: (id: string) => compradoresApi.delete(id),
    onSuccess: invalidate,
  });
}

/**
 * Usuários do LANX para o vínculo. Listar usuários exige administracao.usuarios:read:
 * sem a permissão a consulta nem dispara e o formulário mostra o campo bloqueado.
 */
export function useUsuariosParaVinculoQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["usuarios", "vinculo-comprador"],
    queryFn: () => usuariosApi.list(),
    enabled,
    staleTime: 60_000,
  });
}
