import { z } from "zod";
import type { TipoNaoConformidadeRequest } from "./types";

export const tipoNaoConformidadeSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(200, "Nome muito longo"),
});

export type TipoNaoConformidadeFormData = z.infer<typeof tipoNaoConformidadeSchema>;

/** Formulário → corpo de POST/PUT (usado pela tela e pelo cadastro rápido). */
export const toTipoNaoConformidadeRequest = (data: TipoNaoConformidadeFormData): TipoNaoConformidadeRequest => ({
  nome: data.nome.trim(),
});
