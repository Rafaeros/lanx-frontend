import type { AnalisePedidoResponse } from "../types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { formatCurrency, formatDateBR, formatNumber } from "@/shared/lib/utils";
import { SITUACAO_BADGE, SITUACAO_LABELS, situacaoDe } from "../lib/situacao";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children ?? "-"}</dd>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{titulo}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-3">
        {children}
      </dl>
    </section>
  );
}

export function PedidoDetalhesDialog({
  pedido,
  onClose,
}: {
  pedido: AnalisePedidoResponse | null;
  onClose: () => void;
}) {
  const p = pedido;
  const situacao = p ? situacaoDe(p) : null;

  return (
    <Dialog
      open={!!p}
      onClose={onClose}
      title={`Pedido ${p?.pedidoDeCompra ?? ""}`}
      description={p?.material ? `${p.material.codigo}: ${p.material.descricao}` : undefined}
      maxWidth="2xl"
    >
      {p && situacao && (
        <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
          <Grupo titulo="Requisição">
            <Campo label="RC">{p.requisicaoDeCompra}</Campo>
            <Campo label="Solicitante">{p.solicitante}</Campo>
            <Campo label="Emissão da RC">{formatDateBR(p.dataEmissaoRc)}</Campo>
          </Grupo>

          <Grupo titulo="Pedido e entrega">
            <Campo label="Fornecedor">{p.fornecedor?.nome}</Campo>
            <Campo label="Comprador">{p.comprador?.nome}</Campo>
            <Campo label="País">{p.fornecedor?.pais}</Campo>
            <Campo label="Emissão do PC">{formatDateBR(p.dataEmissaoPc)}</Campo>
            <Campo label="Previsão de entrega">{formatDateBR(p.dataPrevisaoEntregaPc)}</Campo>
            <Campo label="Entregue em">{formatDateBR(p.dataEntregaPc)}</Campo>
            <Campo label="Situação">
              <Badge variant={SITUACAO_BADGE[situacao]}>{SITUACAO_LABELS[situacao]}</Badge>
            </Campo>
            <Campo label="Atendido / solicitado">
              {formatNumber(p.quantidadeAtendida)} / {formatNumber(p.quantidadeSolicitada)} {p.unidadeMedida?.sigla}
            </Campo>
            <Campo label="Lead time">{p.leadTimeDias != null ? `${p.leadTimeDias} dias` : "-"}</Campo>
            <Campo label="Local">{p.local}</Campo>
            <Campo label="Rateio">{p.rateio?.nome}</Campo>
          </Grupo>

          <Grupo titulo="Financeiro e fiscal">
            <Campo label="Valor unitário">{formatCurrency(p.valorUnitario)}</Campo>
            <Campo label="Frete">{formatCurrency(p.valorFrete)}</Campo>
            <Campo label="IPI">{formatCurrency(p.ipi)}</Campo>
            <Campo label="Valor total">{formatCurrency(p.valorTotal)}</Campo>
            <Campo label="Condição de pagamento">{p.condicaoPagamento}</Campo>
            <Campo label="NCM">{p.ncm}</Campo>
            <Campo label="Nota fiscal">{p.notaFiscal}</Campo>
            <Campo label="Recebimento">{p.recebimento}</Campo>
            <Campo label="Invoice">{p.invoice}</Campo>
          </Grupo>

          {p.observacao && (
            <section className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Observações</h3>
              <p className="rounded-xl border border-border p-3 text-sm text-foreground">{p.observacao}</p>
            </section>
          )}

          <div className="flex justify-end border-t border-border pt-3">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
