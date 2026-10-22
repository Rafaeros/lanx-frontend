import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { compradoresApi } from "../api/compradores.api";
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
