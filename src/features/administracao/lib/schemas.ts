import { z } from "zod";
import type { RegisterUserRequest, UpdateUserRequest } from "../types";

/** Mesmas regras do backend (User.USERNAME_FORMAT e PasswordPolicy). */
export const novoUsuarioSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._-]{3,50}$/, "Use de 3 a 50 caracteres: letras minúsculas, números, . _ -"),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres")
    .max(150, "Senha muito longa")
    .regex(/[a-zA-Z]/, "A senha precisa ter letras")
    .regex(/\d/, "A senha precisa ter números"),
  roleIds: z.array(z.string()).min(1, "Escolha pelo menos um perfil"),
  /** Vazio = sem departamento. */
  departamentoId: z.string(),
});

export const editarUsuarioSchema = z.object({
  roleIds: z.array(z.string()).min(1, "Escolha pelo menos um perfil"),
  active: z.boolean(),
  /** Vazio = sem departamento. */
  departamentoId: z.string(),
});

export const perfilSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório").max(50, "Use até 50 caracteres"),
  description: z.string().trim().max(255, "Use até 255 caracteres").optional(),
  permissions: z.array(z.string()).min(1, "Marque pelo menos uma permissão"),
});

export type NovoUsuarioFormData = z.infer<typeof novoUsuarioSchema>;
export type EditarUsuarioFormData = z.infer<typeof editarUsuarioSchema>;
export type PerfilFormData = z.infer<typeof perfilSchema>;

/** Formulário → corpo de POST /auth/users: select vazio = sem departamento. */
export const toRegisterUserRequest = (data: NovoUsuarioFormData): RegisterUserRequest => ({
  ...data,
  departamentoId: data.departamentoId || null,
});

/** Formulário → corpo de PUT /auth/users/{id}: select vazio = sem departamento. */
export const toUpdateUserRequest = (data: EditarUsuarioFormData): UpdateUserRequest => ({
  ...data,
  departamentoId: data.departamentoId || null,
});
