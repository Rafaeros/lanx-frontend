import { z } from "zod";

export const unidadeMedidaSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
  sigla: z.string().trim().min(1, "A sigla é obrigatória").max(10, "Sigla muito longa"),
});

export type UnidadeMedidaFormData = z.infer<typeof unidadeMedidaSchema>;
