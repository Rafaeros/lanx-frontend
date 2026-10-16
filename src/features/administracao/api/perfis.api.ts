import apiClient from "@/shared/api/client";
import type { ApiResponse, FeatureNode, RoleRequest, RoleResponse } from "@/shared/api/schema";
import { env } from "@/config/env";
import { MOCK_FEATURES, mockStore } from "./mock-data";

export const perfisApi = {
  /** GET /auth/roles (exige administracao.permissoes:read). */
  list: async (): Promise<RoleResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<RoleResponse[]>>("/auth/roles");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return [...mockStore.roles];
      throw error;
    }
  },

  /** GET /auth/features: catálogo do que pode ser concedido. */
  features: async (): Promise<FeatureNode[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FeatureNode[]>>("/auth/features");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return MOCK_FEATURES;
      throw error;
    }
  },

  create: async (data: RoleRequest): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<{ id: string }>>("/auth/roles", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const id = crypto.randomUUID();
        mockStore.roles.push({ id, ...data, name: data.name.toUpperCase() });
        return { id };
      }
      throw error;
    }
  },

  update: async (id: string, data: RoleRequest): Promise<void> => {
    try {
      await apiClient.put<ApiResponse<void>>(`/auth/roles/${id}`, data);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockStore.roles = mockStore.roles.map((r) =>
          r.id === id ? { ...r, ...data, name: data.name.toUpperCase() } : r
        );
        return;
      }
      throw error;
    }
  },
};
