import { z } from "zod";
import { soDigitos } from "./lib/cnpj";

export const clienteSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(250, "Nome muito longo"),
  /** Vazio = sem CNPJ. Os dígitos verificadores são conferidos pelo backend. */
  cnpj: z.string().refine((v) => {
    const d = soDigitos(v);
    return d.length === 0 || d.length === 14;
  }, "O CNPJ tem 14 dígitos"),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
