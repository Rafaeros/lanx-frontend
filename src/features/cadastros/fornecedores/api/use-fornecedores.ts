import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fornecedoresApi } from "./fornecedores.api";
import type { CreateFornecedorRequest, FornecedorFilter, UpdateFornecedorRequest } from "../types";

export function useFornecedoresQuery(filter: FornecedorFilter = {}, page = 0, size = 20) {
  return useQuery({
    queryKey: ["fornecedores", filter, page, size],
    queryFn: () => fornecedoresApi.findAll(filter, page, size),
  });
}

/** Países mudam só pelo seeder: cache longo. */
export function usePaisesQuery() {
  return useQuery({
    queryKey: ["paises"],
    queryFn: () => fornecedoresApi.findPaises(),
    staleTime: Infinity,
  });
}

export function useCreateFornecedorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFornecedorRequest) => fornecedoresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
    },
  });
}

export function useUpdateFornecedorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFornecedorRequest }) => fornecedoresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
    },
  });
}

export function useDeleteFornecedorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fornecedoresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
    },
  });
}
