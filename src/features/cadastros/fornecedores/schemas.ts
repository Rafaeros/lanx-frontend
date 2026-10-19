import { z } from "zod";

export const fornecedorSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .max(255, "Nome muito longo"),
  /** Vazio = sem país. */
  paisId: z.string(),
});

export type FornecedorFormData = z.infer<typeof fornecedorSchema>;
