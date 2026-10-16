import type { AnalisePedidoResponse, SituacaoPedido } from "@/shared/api/schema";
import type { BadgeProps } from "@/shared/components/ui/badge";

export const SITUACAO_LABELS: Record<SituacaoPedido, string> = {
  PENDENTE: "Pendente",
  PARCIAL: "Parcial",
  ATENDIDO: "Atendido",
};

export const SITUACAO_BADGE: Record<SituacaoPedido, BadgeProps["variant"]> = {
  PENDENTE: "secondary",
  PARCIAL: "warning",
  ATENDIDO: "success",
};

/** Mesma regra do backend (domain.Situacao), usada se a resposta não trouxer `situacao`. */
export function situacaoDe(item: AnalisePedidoResponse): SituacaoPedido {
  if (item.situacao) return item.situacao;
  const atendida = item.quantidadeAtendida ?? 0;
  if (atendida <= 0) return "PENDENTE";
  return (item.saldo ?? 0) > 0 ? "PARCIAL" : "ATENDIDO";
}
