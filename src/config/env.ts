import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string().default("LANX Sistema de Gestão"),
  VITE_API_BASE_URL: z.string().default("/api/v1"),
  VITE_API_PROXY_TARGET: z.string().default("http://localhost:8080"),
  VITE_ENABLE_MOCK_FALLBACK: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .default(false),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error("❌ Erro na validação das variáveis de ambiente:", parsedEnv.error.format());
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      VITE_APP_NAME: "LANX Sistema de Gestão",
      VITE_API_BASE_URL: "/api/v1",
      VITE_API_PROXY_TARGET: "http://localhost:8080",
      VITE_ENABLE_MOCK_FALLBACK: true,
    };

