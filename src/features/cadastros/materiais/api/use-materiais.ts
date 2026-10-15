import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materiaisApi } from "./materiais.api";
import { unidadeMedidaApi } from "../../unidade-medida/api/unidade-medida.api";
import type {
  CreateMaterialRequest,
  MaterialFilter,
  MaterialResponse,
  UpdateMaterialRequest,
} from "@/shared/api/schema";

export function useMateriaisQuery(
  filter: MaterialFilter = {},
  page = 0,
  size = 10
) {
  return useQuery({
    queryKey: ["materiais", filter, page, size],
    queryFn: () => materiaisApi.findAll(filter, page, size),
  });
}

export function useMaterialQuery(id: string | null) {
  return useQuery({
    queryKey: ["material", id],
    queryFn: () => materiaisApi.findById(id!),
    enabled: !!id,
  });
}

export function useUnidadesMedidaQuery() {
  return useQuery({
    queryKey: ["unidadesMedida"],
    queryFn: () => unidadeMedidaApi.findAll(),
  });
}

export function useCreateMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => materiaisApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
    },
  });
}

export function useUpdateMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialRequest }) =>
      materiaisApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      queryClient.invalidateQueries({ queryKey: ["material"] });
    },
  });
}

export function useDeleteMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => materiaisApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
    },
  });
}

