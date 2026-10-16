import type { AxiosError } from "axios";
import type { ApiResponse } from "@/shared/types";

/** Extrai a mensagem mais útil de um erro da API (mensagem do backend > erros de campo > fallback). */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiResponse<unknown>>;
  const body = axiosError?.response?.data;
  if (body?.errors?.length) {
    return body.errors.map((e) => `${e.field}: ${e.message}`).join("; ");
  }
  if (body?.message) return body.message;
  if (axiosError?.response?.status === 403) return "Você não tem permissão para esta ação.";
  if (axiosError?.code === "ERR_NETWORK") return "Não foi possível conectar ao servidor.";
  return fallback;
}
