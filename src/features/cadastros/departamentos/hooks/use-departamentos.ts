import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departamentosApi } from "../api/departamentos.api";
import type { DepartamentoFilter, DepartamentoRequest } from "../types";

/** Chave raiz: invalida tanto a busca paginada quanto a lista usada no select de operadores. */
const DEPARTAMENTOS_KEY = "departamentos";

export function useDepartamentosSearchQuery(filter: DepartamentoFilter, page: number, size: number) {
  return useQuery({
    queryKey: [DEPARTAMENTOS_KEY, "search", filter, page, size],
    queryFn: () => departamentosApi.search(filter, page, size),
  });
}

export function useDepartamentosQuery() {
  return useQuery({
    queryKey: [DEPARTAMENTOS_KEY, "all"],
    queryFn: () => departamentosApi.findAll(),
  });
}

function useInvalidateDepartamentos() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_KEY] });
    // Operadores exibem o nome do departamento
    queryClient.invalidateQueries({ queryKey: ["operadores"] });
  };
}

export function useCreateDepartamentoMutation() {
  const invalidate = useInvalidateDepartamentos();
  return useMutation({
    mutationFn: (data: DepartamentoRequest) => departamentosApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateDepartamentoMutation() {
  const invalidate = useInvalidateDepartamentos();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartamentoRequest }) => departamentosApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteDepartamentoMutation() {
  const invalidate = useInvalidateDepartamentos();
  return useMutation({
    mutationFn: (id: string) => departamentosApi.delete(id),
    onSuccess: invalidate,
  });
}
