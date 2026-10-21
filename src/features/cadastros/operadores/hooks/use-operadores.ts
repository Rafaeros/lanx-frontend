import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operadoresApi } from "../api/operadores.api";
import type { OperadorFilter, OperadorRequest } from "../types";

const OPERADORES_KEY = "operadores";

export function useOperadoresSearchQuery(filter: OperadorFilter, page: number, size: number) {
  return useQuery({
    queryKey: [OPERADORES_KEY, "search", filter, page, size],
    queryFn: () => operadoresApi.search(filter, page, size),
  });
}

function useInvalidateOperadores() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [OPERADORES_KEY] });
  };
}

export function useCreateOperadorMutation() {
  const invalidate = useInvalidateOperadores();
  return useMutation({
    mutationFn: (data: OperadorRequest) => operadoresApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateOperadorMutation() {
  const invalidate = useInvalidateOperadores();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OperadorRequest }) => operadoresApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteOperadorMutation() {
  const invalidate = useInvalidateOperadores();
  return useMutation({
    mutationFn: (id: string) => operadoresApi.delete(id),
    onSuccess: invalidate,
  });
}
