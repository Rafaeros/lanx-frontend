import { z } from "zod";
import { PASSWORD_MAX_BYTES, PASSWORD_RULES } from "./lib/first-access";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "O usuário é obrigatório")
    .max(100, "Usuário muito longo"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .max(150, "Senha muito longa"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


/** Senha do primeiro acesso: as regras fortes do backend + confirmação igual. */
export function firstAccessSchema(username: string) {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, "Informe a nova senha")
        .refine((s) => new TextEncoder().encode(s).length <= PASSWORD_MAX_BYTES, "Senha longa demais")
        .refine((s) => PASSWORD_RULES.every((r) => r.test(s, username)), "A senha não atende a todos os requisitos"),
      confirmPassword: z.string().min(1, "Confirme a nova senha"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: "As senhas não conferem",
      path: ["confirmPassword"],
    });
}

export type FirstAccessFormData = z.infer<ReturnType<typeof firstAccessSchema>>;
