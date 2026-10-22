import { z } from "zod";

export const rateioSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(100, "Nome muito longo"),
});

export type RateioFormData = z.infer<typeof rateioSchema>;
