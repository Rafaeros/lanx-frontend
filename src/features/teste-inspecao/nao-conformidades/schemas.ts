import { z } from "zod";
import { hojeIso } from "@/shared/lib/date";

/** Aceita "6" ou "6,5"; o backend guarda até 4 casas. */
const quantidade = z
  .string()
  .trim()
  .min(1, "A quantidade é obrigatória")
  .refine((v) => /^\d+([.,]\d{1,4})?$/.test(v), "Use só números (até 4 casas decimais)")
  .refine((v) => Number(v.replace(",", ".")) > 0, "A quantidade deve ser maior que zero");

export const naoConformidadeSchema = z.object({
  ordemDeProducaoId: z.string().min(1, "Selecione a OP"),
  tipoNaoConformidadeId: z.string().min(1, "Selecione a não conformidade"),
  departamentoId: z.string().min(1, "Selecione o departamento"),
  /** Vazio = sem operador. */
  operadorId: z.string(),
  quantidadeNaoConforme: quantidade,
  dataNaoConformidade: z
    .string()
    .min(1, "Informe a data")
    .refine((v) => v <= hojeIso(), "A data não pode ser futura"),
});

export type NaoConformidadeFormData = z.infer<typeof naoConformidadeSchema>;
