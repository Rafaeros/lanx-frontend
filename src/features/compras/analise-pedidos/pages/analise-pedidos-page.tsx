import * as React from "react";
import { ChartColumn, Download, RefreshCw } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import type { AnalisePedidoResponse, AnalisePedidosFiltro } from "@/shared/api/schema";
import {
  useAnalisePedidosQuery,
  useImportarPedidosMutation,
  useResumoAnalisePedidosQuery,
} from "../hooks/use-analise-pedidos";
import { AnaliseFiltros, type AnaliseFiltrosValue } from "../components/analise-filtros";
import { AnaliseResumo } from "../components/analise-resumo";
import { AnalisePedidosTable } from "../components/analise-pedidos-table";
import { PedidoDetalhesDialog } from "../components/pedido-detalhes-dialog";
import { ImportarPedidosDialog } from "../components/importar-pedidos-dialog";
import { mesAtual } from "../lib/periodo";

function filtrosIniciais(): AnaliseFiltrosValue {
  const { inicio, fim } = mesAtual();
  return { dataInicio: inicio, dataFim: fim, busca: "", situacao: "" };
}

export function AnalisePedidosPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [filtros, setFiltros] = React.useState<AnaliseFiltrosValue>(filtrosIniciais);
  const busca = useDebounce(filtros.busca, 350);

  const periodoInvalido = !filtros.dataInicio || !filtros.dataFim || filtros.dataInicio > filtros.dataFim;
  const filtro: AnalisePedidosFiltro = React.useMemo(
    () => ({ dataInicio: filtros.dataInicio, dataFim: filtros.dataFim, busca, situacao: filtros.situacao }),
    [filtros.dataInicio, filtros.dataFim, filtros.situacao, busca]
  );

  const itens = useAnalisePedidosQuery(filtro, page, size, !periodoInvalido);
  const resumo = useResumoAnalisePedidosQuery(filtro, !periodoInvalido);
  const importar = useImportarPedidosMutation();

  const [importOpen, setImportOpen] = React.useState(false);
  const [detalhe, setDetalhe] = React.useState<AnalisePedidoResponse | null>(null);

  // qualquer mudança de filtro volta para a primeira página
  React.useEffect(() => setPage(0), [filtro, setPage]);

  const handleImport = (periodo: { dataInicio: string; dataFim: string }) =>
    importar.mutate(periodo, {
      onSuccess: (res) => {
        toast.success("Importação concluída", `${res.itensImportados} itens importados do ERP.`);
        setImportOpen(false);
      },
      onError: (err) =>
        toast.error("Não foi possível importar os pedidos", getApiErrorMessage(err, "Tente novamente.")),
    });

  const emptyMessage = itens.isError
    ? getApiErrorMessage(itens.error, "Não foi possível carregar os pedidos.")
    : filtros.busca || filtros.situacao
      ? "Nenhum pedido com esses filtros. Tente limpar a busca ou a situação."
      : "Nenhum pedido emitido no período. Ajuste as datas ou importe os pedidos do ERP.";

  const refresh = () => {
    itens.refetch();
    resumo.refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ChartColumn}
        title="Análise de pedidos"
        description="Requisições, pedidos emitidos, fornecedores e cumprimento de entregas"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={itens.isFetching || periodoInvalido}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 ${itens.isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="compras.analise-pedidos:importar">
              <Button variant="primary" size="sm" onClick={() => setImportOpen(true)} className="h-9">
                <Download className="h-4 w-4" />
                Importar do ERP
              </Button>
            </PermissionGate>
          </>
        }
      />

      <AnaliseFiltros
        value={filtros}
        onChange={setFiltros}
        onClear={() => setFiltros((f) => ({ ...f, busca: "", situacao: "" }))}
        periodoInvalido={periodoInvalido}
      />

      <AnaliseResumo resumo={periodoInvalido ? undefined : resumo.data} isLoading={resumo.isLoading} />

      <AnalisePedidosTable
        data={periodoInvalido || itens.isError ? null : itens.data}
        isLoading={itens.isLoading}
        emptyMessage={emptyMessage}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        onDetails={setDetalhe}
      />

      <ImportarPedidosDialog
        open={importOpen}
        periodoInicial={{ dataInicio: filtros.dataInicio, dataFim: filtros.dataFim }}
        isLoading={importar.isPending}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <PedidoDetalhesDialog pedido={detalhe} onClose={() => setDetalhe(null)} />
    </div>
  );
}
