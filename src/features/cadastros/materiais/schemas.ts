import { z } from "zod";

export const materialSchema = z.object({
  codigo: z
    .string()
    .min(1, "O código é obrigatório")
    .max(50, "Código muito longo"),
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(255, "Descrição muito longa"),
  unidadeMedidaId: z
    .string()
    .min(1, "Selecione uma unidade de medida"),
});

export type MaterialFormData = z.infer<typeof materialSchema>;

