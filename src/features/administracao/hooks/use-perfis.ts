import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RoleRequest } from "../types";
import { perfisApi } from "../api/perfis.api";

const PERFIS_KEY = ["admin", "perfis"];

export function usePerfisQuery() {
  return useQuery({ queryKey: PERFIS_KEY, queryFn: perfisApi.list });
}

export function useFeatureCatalogQuery() {
  return useQuery({ queryKey: ["admin", "features"], queryFn: perfisApi.features, staleTime: Infinity });
}

function useInvalidateAfterRoleChange() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: PERFIS_KEY });
    // usuários exibem o nome dos perfis; a navegação muda se o perfil for do próprio admin
    queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
    queryClient.invalidateQueries({ queryKey: ["navigation"] });
  };
}

export function useCreatePerfilMutation() {
  const invalidate = useInvalidateAfterRoleChange();
  return useMutation({ mutationFn: (data: RoleRequest) => perfisApi.create(data), onSuccess: invalidate });
}

export function useUpdatePerfilMutation() {
  const invalidate = useInvalidateAfterRoleChange();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleRequest }) => perfisApi.update(id, data),
    onSuccess: invalidate,
  });
}
