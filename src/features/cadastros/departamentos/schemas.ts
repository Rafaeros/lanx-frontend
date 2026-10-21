import { z } from "zod";

export const departamentoSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;
