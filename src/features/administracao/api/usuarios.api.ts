import apiClient from "@/shared/api/client";
import type { ApiResponse, UserResponse } from "@/shared/types";
import type { RegisterUserRequest, UpdateUserRequest } from "../types";
import { env } from "@/config/env";
import { mockStore } from "./mock-data";

function rolesFor(ids: string[]) {
  return mockStore.roles.filter((r) => ids.includes(r.id)).map(({ id, name }) => ({ id, name }));
}

export const usuariosApi = {
  /** GET /auth/users (exige administracao.usuarios:read). */
  list: async (): Promise<UserResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<UserResponse[]>>("/auth/users");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return [...mockStore.users];
      throw error;
    }
  },

  create: async (data: RegisterUserRequest): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<{ id: string }>>("/auth/users", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const id = crypto.randomUUID();
        mockStore.users.push({
          id,
          username: data.username.toLowerCase(),
          active: true,
          roles: rolesFor(data.roleIds),
          permissions: [],
        });
        return { id };
      }
      throw error;
    }
  },

  update: async (id: string, data: UpdateUserRequest): Promise<void> => {
    try {
      await apiClient.put<ApiResponse<void>>(`/auth/users/${id}`, data);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockStore.users = mockStore.users.map((u) =>
          u.id === id ? { ...u, active: data.active, roles: rolesFor(data.roleIds) } : u
        );
        return;
      }
      throw error;
    }
  },
};
