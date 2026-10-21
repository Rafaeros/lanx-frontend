import { useMutation } from "@tanstack/react-query";
import { comunizadoApi, type GerarComunizadoParams } from "../api/comunizado.api";

export function useGerarComunizadoMutation() {
  return useMutation({ mutationFn: (params: GerarComunizadoParams) => comunizadoApi.gerar(params) });
}
