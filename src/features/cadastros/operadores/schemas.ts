import { z } from "zod";
import type { OperadorRequest } from "./types";

export const operadorSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
  /** Vazio = sem departamento. */
  departamentoId: z.string(),
  /** Vazio = sem usuário vinculado. */
  userId: z.string(),
});

export type OperadorFormData = z.infer<typeof operadorSchema>;

/** Formulário → corpo de POST/PUT: select vazio = sem departamento / sem usuário. */
export const toOperadorRequest = (data: OperadorFormData): OperadorRequest => ({
  nome: data.nome.trim(),
  departamentoId: data.departamentoId || null,
  userId: data.userId || null,
});
