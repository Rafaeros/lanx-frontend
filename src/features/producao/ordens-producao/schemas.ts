import { z } from "zod";

/** Aceita "74" ou "74,5"; o backend guarda até 4 casas. */
const quantidade = z
  .string()
  .trim()
  .min(1, "A quantidade é obrigatória")
  .refine((v) => /^\d+([.,]\d{1,4})?$/.test(v), "Use só números (até 4 casas decimais)")
  .refine((v) => Number(v.replace(",", ".")) > 0, "A quantidade deve ser maior que zero");

export const ordemProducaoSchema = z.object({
  codigo: z.string().trim().min(1, "O código da OP é obrigatório").max(10, "Máximo de 10 caracteres"),
  clienteId: z.string().min(1, "Selecione o cliente"),
  materialId: z.string().min(1, "Selecione o produto"),
  quantidade,
  previsao: z.string().min(1, "Informe a previsão"),
  /** Vazio = OP ainda não iniciada. */
  etapaAtual: z.string().trim().max(100, "Máximo de 100 caracteres"),
});

export type OrdemProducaoFormData = z.infer<typeof ordemProducaoSchema>;
