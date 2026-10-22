import { z } from "zod";

export const operadorSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
  /** Vazio = sem departamento. */
  departamentoId: z.string(),
  /** Vazio = sem usuário vinculado. */
  userId: z.string(),
});

export type OperadorFormData = z.infer<typeof operadorSchema>;
