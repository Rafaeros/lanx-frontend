import { z } from "zod";
import type { DepartamentoRequest } from "./types";

export const departamentoSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;

/** Formulário → corpo de POST/PUT (usado pela tela e pelo cadastro rápido). */
export const toDepartamentoRequest = (data: DepartamentoFormData): DepartamentoRequest => ({ nome: data.nome.trim() });
