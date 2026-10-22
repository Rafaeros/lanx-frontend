import apiClient, { tokenStorage } from "@/shared/api/client";
import type { ApiResponse, NavigationNode, UserResponse } from "@/shared/types";
import type { FirstAccessRequest, LoginRequest, LoginResponse } from "../types";
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
      {
        key: "cadastros.fornecedores",
        label: "Fornecedores",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.departamentos",
        label: "Departamentos",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.operadores",
        label: "Operadores",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.compradores",
        label: "Compradores",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.rateios",
        label: "Rateios",
        actions: ["read", "create", "update", "delete"],
        children: [],
      },
      {
        key: "cadastros.pais",
        label: "Países",
        actions: ["read"],
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
      {
        key: "compras.iqf",
        label: "IQF de Fornecedores",
        actions: ["read"],
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
      // primeiro acesso não traz token: só depois de definir a senha
      if (data.accessToken) tokenStorage.set(data.accessToken);
      return data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        console.warn("Backend indisponível, usando autenticação mock de desenvolvimento.");
        const mockResponse: LoginResponse = {
          accessToken: "mock-jwt-token-lanx-" + Date.now(),
          tokenType: "Bearer",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          firstAccess: false,
        };
        tokenStorage.set(mockResponse.accessToken!);
        localStorage.setItem("lanx_mock_username", credentials.username);
        return mockResponse;
      }
      throw error;
    }
  },

  /** POST /auth/first-access (público): define a senha do primeiro acesso e já entra. */
  firstAccess: async (request: FirstAccessRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/first-access", request);
    const data = response.data.data;
    if (data.accessToken) tokenStorage.set(data.accessToken);
    return data;
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
