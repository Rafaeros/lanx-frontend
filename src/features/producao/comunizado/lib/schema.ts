import { z } from "zod";

const opcional = (max: number) => z.string().trim().max(max, `Máximo de ${max} caracteres`);

/**
 * Campos que completam a IT (operador, OP, quantidade, início, fim) ou
 * sobrescrevem o que ela traz (produto, data da revisão). Todos opcionais:
 * o que ficar vazio sai em branco na planilha para preencher à mão.
 */
export const comunizadoSchema = z.object({
  operador: opcional(80),
  op: opcional(40),
  quantidade: opcional(30),
  inicio: opcional(40),
  fim: opcional(40),
  realizadoEm: z.string(),
  produto: opcional(60),
  docReferencia: z.string(),
});

export type ComunizadoFormData = z.infer<typeof comunizadoSchema>;
