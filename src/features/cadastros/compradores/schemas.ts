import { z } from "zod";

export const compradorSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(150, "Nome muito longo"),
  /** Vazio = sem usuário vinculado. */
  userId: z.string(),
});

export type CompradorFormData = z.infer<typeof compradorSchema>;
