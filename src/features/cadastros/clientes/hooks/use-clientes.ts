import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientesApi } from "../api/clientes.api";
import type { ClienteFilter, ClienteRequest } from "../types";

/** Chave raiz: invalida a busca paginada e a lista usada no formulário da OP. */
const CLIENTES_KEY = "clientes";

export function useClientesSearchQuery(filter: ClienteFilter, page: number, size: number) {
  return useQuery({
    queryKey: [CLIENTES_KEY, "search", filter, page, size],
    queryFn: () => clientesApi.search(filter, page, size),
  });
}

export function useClientesQuery(enabled = true) {
  return useQuery({
    queryKey: [CLIENTES_KEY, "all"],
    queryFn: () => clientesApi.findAll(),
    enabled,
  });
}

function useInvalidateClientes() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [CLIENTES_KEY] });
    // As ordens de produção exibem o nome do cliente
    queryClient.invalidateQueries({ queryKey: ["ordens-producao"] });
  };
}

export function useCreateClienteMutation() {
  const invalidate = useInvalidateClientes();
  return useMutation({
    mutationFn: (data: ClienteRequest) => clientesApi.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateClienteMutation() {
  const invalidate = useInvalidateClientes();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClienteRequest }) => clientesApi.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteClienteMutation() {
  const invalidate = useInvalidateClientes();
  return useMutation({
    mutationFn: (id: string) => clientesApi.delete(id),
    onSuccess: invalidate,
  });
}
