/**
 * Credencial provisória entre o login e a tela de primeiro acesso. Fica só em
 * memória (nunca em storage nem no history): recarregar a página volta ao login.
 */
export interface PendingFirstAccess {
  username: string;
  password: string;
  redirect: string;
}

let pending: PendingFirstAccess | null = null;

export const firstAccessStore = {
  set: (value: PendingFirstAccess) => {
    pending = value;
  },
  get: () => pending,
  clear: () => {
    pending = null;
  },
};

/** Mesmas regras do backend (PasswordPolicy.validateStrong), para o checklist ao vivo. */
export const PASSWORD_RULES: { id: string; label: string; test: (senha: string, username: string) => boolean }[] = [
  { id: "tamanho", label: "Pelo menos 10 caracteres", test: (s) => s.length >= 10 },
  { id: "maiuscula", label: "Uma letra maiúscula", test: (s) => /\p{Lu}/u.test(s) },
  { id: "minuscula", label: "Uma letra minúscula", test: (s) => /\p{Ll}/u.test(s) },
  { id: "numero", label: "Um número", test: (s) => /\d/.test(s) },
  { id: "simbolo", label: "Um símbolo (ex.: ! @ # $ %)", test: (s) => /[^\p{L}\p{N}\s]/u.test(s) },
  { id: "espaco", label: "Sem espaços", test: (s) => s.length > 0 && !/\s/.test(s) },
  {
    id: "usuario",
    label: "Não conter o nome de usuário",
    test: (s, u) => s.length > 0 && (!u || !s.toLowerCase().includes(u.toLowerCase())),
  },
];

/** O BCrypt considera só 72 bytes. */
export const PASSWORD_MAX_BYTES = 72;
