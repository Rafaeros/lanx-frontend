import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analisePedidosApi } from "../api/analise-pedidos.api";
import { formatCurrency, formatDateBR, formatNumber } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog } from "@/shared/components/ui/dialog";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { AnalisePedidoResponse } from "@/shared/api/schema";
import {
  Download,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";

export function AnalisePedidosPage() {
  const queryClient = useQueryClient();
  const [dataInicio, setDataInicio] = React.useState("2026-10-01");
  const [dataFim, setDataFim] = React.useState("2026-10-31");
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const [selectedPedido, setSelectedPedido] = React.useState<AnalisePedidoResponse | null>(null);

  // Consulta de pedidos
  const { data: pedidos = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["analise-pedidos", dataInicio, dataFim],
    queryFn: () => analisePedidosApi.consultar({ dataInicio, dataFim }),
  });

  // Mutação para importar pedidos
  const importarMutation = useMutation({
    mutationFn: () => analisePedidosApi.importar(dataInicio, dataFim),
    onSuccess: (res) => {
      alert(`Importação concluída com sucesso! ${res.itensImportados} itens processados.`);
      setImportModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["analise-pedidos"] });
    },
    onError: (err: any) => {
      alert("Erro ao importar pedidos: " + (err?.message || "Tente novamente"));
    },
  });

  // Cálculos de KPI
  const totalValor = pedidos.reduce((acc, p) => acc + (p.valorTotal || 0), 0);
  const totalParciais = pedidos.filter((p) => p.atendimentoParcial).length;
  const leadTimeMedio =
    pedidos.length > 0
      ? Math.round(pedidos.reduce((acc, p) => acc + (p.leadTimeDias || 0), 0) / pedidos.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Análise de Pedidos de Compras
            </h1>
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Acompanhe requisições, pedidos emitidos, fornecedores e cumprimento de entregas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <PermissionGate permission="compras.analise-pedidos:importar">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Importar do ERP</span>
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
                Total de Pedidos
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{pedidos.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
                Volume Financeiro
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {formatCurrency(totalValor)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
                Atendimentos Parciais
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{totalParciais}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
                Lead Time Médio
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {leadTimeMedio} dias
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)] font-medium">De:</span>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-40 h-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)] font-medium">Até:</span>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-40 h-9 text-xs"
              />
            </div>
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            Filtrando compras do período selecionado
          </div>
        </CardContent>
      </Card>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--card-border)] bg-[var(--muted)]/60 text-xs uppercase font-semibold text-[var(--muted-foreground)] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pedido / RC</th>
                <th className="px-4 py-3.5">Fornecedor</th>
                <th className="px-4 py-3.5">Item</th>
                <th className="px-4 py-3.5 text-center">Qtd. Solicitada</th>
                <th className="px-4 py-3.5 text-center">Qtd. Atendida</th>
                <th className="px-4 py-3.5 text-center">Status Saldo</th>
                <th className="px-4 py-3.5 text-right">Valor Total</th>
                <th className="px-4 py-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)] bg-[var(--card-bg)]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-[var(--muted-foreground)]">
                    Carregando análise de pedidos...
                  </td>
                </tr>
              ) : pedidos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-[var(--muted-foreground)]">
                    Nenhum pedido encontrado para o período informado.
                  </td>
                </tr>
              ) : (
                pedidos.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--foreground)]">{p.pedidoDeCompra}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{p.requisicaoDeCompra}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--foreground)]">{p.fornecedor}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{p.comprador}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-[var(--brand-purple)]">{p.codigoItem}</div>
                      <div className="text-xs text-[var(--muted-foreground)] max-w-xs truncate">
                        {p.descricaoItem}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {formatNumber(p.quantidadeSolicitada)} {p.unidadeMedida}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {formatNumber(p.quantidadeAtendida)} {p.unidadeMedida}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.atendimentoParcial ? (
                        <Badge variant="warning">Parcial (Saldo: {p.saldo})</Badge>
                      ) : (
                        <Badge variant="success">Totalmente Atendido</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                      {formatCurrency(p.valorTotal)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPedido(p)}
                        className="h-8 w-8 p-0"
                        title="Ver detalhes completos"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Importar */}
      <Dialog
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Importar Pedidos do ERP"
        description="Dispara a sincronização de pedidos e notas fiscais com a base do ERP."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                Data Inicial
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                Data Final
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
            <Button
              variant="outline"
              onClick={() => setImportModalOpen(false)}
              disabled={importarMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="gradient"
              onClick={() => importarMutation.mutate()}
              isLoading={importarMutation.isPending}
            >
              Iniciar Importação
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal Detalhes do Pedido */}
      <Dialog
        open={!!selectedPedido}
        onClose={() => setSelectedPedido(null)}
        title={`Detalhes do Pedido: ${selectedPedido?.pedidoDeCompra}`}
        description="Visualização detalhada das informações comerciais, logísticas e fiscais."
        maxWidth="2xl"
      >
        {selectedPedido && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--muted)]/50 border border-[var(--card-border)]">
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Requisição:</span>
                <span className="font-semibold">{selectedPedido.requisicaoDeCompra}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Solicitante:</span>
                <span className="font-medium">{selectedPedido.solicitante}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Data Emissão RC:</span>
                <span>{formatDateBR(selectedPedido.dataEmissaoRc)}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Fornecedor:</span>
                <span className="font-semibold">{selectedPedido.fornecedor}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Nota Fiscal:</span>
                <span>{selectedPedido.notaFiscal || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Recebimento:</span>
                <span>{selectedPedido.recebimento || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Condição de Pgto:</span>
                <span>{selectedPedido.condicaoPagamento || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Valor Frete:</span>
                <span>{formatCurrency(selectedPedido.valorFrete)}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">IPI:</span>
                <span>{formatCurrency(selectedPedido.ipi)}</span>
              </div>
            </div>

            {selectedPedido.observacao && (
              <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
                <span className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Observações:
                </span>
                <p className="text-xs text-[var(--foreground)]">{selectedPedido.observacao}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedPedido(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

