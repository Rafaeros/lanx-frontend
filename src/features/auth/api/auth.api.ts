import apiClient, { tokenStorage } from "@/shared/api/client";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  NavigationNode,
  UserResponse,
} from "@/shared/api/schema";
import { env } from "@/config/env";
import { decodeJwtPayload } from "../lib/jwt";

const MOCK_NAVIGATION: NavigationNode[] = [
  {
    key: "cadastros",
    label: "Cadastros",
    actions: ["read", "create", "update", "delete"],
    children: [
      {
        key: "cadastros.materiais",
        label: "Materiais",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.unidade-medida",
        label: "Unidades de Medida",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
    ],
  },
  {
    key: "compras",
    label: "Compras",
    actions: ["read", "create", "update", "delete"],
    children: [
      {
        key: "compras.analise-pedidos",
        label: "Análise de Pedidos",
        actions: ["read", "importar"],
        children: [],
      },
    ],
  },
  {
    key: "administracao",
    label: "Administração",
    actions: ["read", "create", "update", "delete"],
    children: [
      {
        key: "administracao.usuarios",
        label: "Usuários",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "administracao.permissoes",
        label: "Perfis e Permissões",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
    ],
  },
];

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );
      const data = response.data.data;
      tokenStorage.set(data.accessToken);
      return data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        console.warn("Backend indisponível, usando autenticação mock de desenvolvimento.");
        const mockResponse: LoginResponse = {
          accessToken: "mock-jwt-token-lanx-" + Date.now(),
          tokenType: "Bearer",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
        tokenStorage.set(mockResponse.accessToken);
        localStorage.setItem("lanx_mock_username", credentials.username);
        return mockResponse;
      }
      throw error;
    }
  },

  getNavigation: async (): Promise<NavigationNode[]> => {
    try {
      const response = await apiClient.get<ApiResponse<NavigationNode[]>>(
        "/auth/me/navigation"
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        return MOCK_NAVIGATION;
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const payload = decodeJwtPayload(token);
    const userId = payload?.sub;
    const username = payload?.username || localStorage.getItem("lanx_mock_username") || "Usuário";

    // /auth/users/{id} exige administracao.usuarios:read; para os demais usuários o perfil
    // é montado a partir das claims do JWT e as permissões vêm da árvore de navegação (useCan).
    const fromClaims: UserResponse = {
      id: userId ?? "anonymous",
      username,
      active: true,
      roles: [],
      permissions: [],
    };

    if (!userId) return fromClaims;

    try {
      const response = await apiClient.get<ApiResponse<UserResponse>>(`/auth/users/${userId}`);
      return response.data.data;
    } catch {
      return fromClaims;
    }
  },

  logout: () => {
    tokenStorage.remove();
    localStorage.removeItem("lanx_mock_username");
  },
};
