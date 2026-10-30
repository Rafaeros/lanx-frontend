import { Bell, ShieldAlert, type LucideIcon } from "lucide-react";
import type { TipoNotificacao } from "../types";

/** Ícone de cada tipo. Tipo novo no backend: acrescente aqui (os desconhecidos usam o sino). */
const ICONES: Record<TipoNotificacao, LucideIcon> = {
  NAO_CONFORMIDADE_CRIADA: ShieldAlert,
};

export function iconeDaNotificacao(tipo: TipoNotificacao): LucideIcon {
  return ICONES[tipo] ?? Bell;
}
