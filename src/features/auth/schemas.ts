import { z } from "zod";

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

