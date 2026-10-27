import * as React from "react";
import { ChartBarBig, ClipboardList, Table2 } from "lucide-react";
import type { CarteiraFiltro, CarteiraItemResponse } from "../types";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { paginate } from "@/shared/lib/pagination";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { Segmented } from "@/shared/components/ui/segmented";
import { useToast } from "@/shared/components/ui/toast";
import { useCarteiraQuery, useExportarCarteiraMutation } from "../hooks/use-carteira";
import { SITUACOES, filtrarCarteira, type SituacaoFiltro } from "../lib/carteira";
import { CarteiraAcoes } from "../components/carteira-acoes";
import { CarteiraAguardando, CarteiraAtualizando, CarteiraCarregando } from "../components/carteira-carregando";
import { CarteiraClientesChart } from "../components/carteira-clientes-chart";
import { CarteiraErro } from "../components/carteira-erro";
import { CarteiraFiltrosTabela } from "../components/carteira-filtros-tabela";
import { CarteiraPeriodoFiltro, periodoValido } from "../components/carteira-periodo-filtro";
import { CarteiraResumoCards } from "../components/carteira-resumo";
import { CarteiraTable } from "../components/carteira-table";
import { MateriaisPendentesDialog } from "../components/materiais-pendentes-dialog";
import { CarteiraRelatorioImpressao } from "../components/carteira-relatorio-impressao";

const SEM_PERIODO: CarteiraFiltro = { dataInicio: "", dataFim: "" };

type Visao = "tabela" | "clientes";

const VISOES: { id: Visao; label: React.ReactNode }[] = [
  {
    id: "tabela",
    label: (
      <>
        <Table2 className="h-4 w-4" />
        Pedidos
      </>
    ),
  },
  {
    id: "clientes",
    label: (
      <>
        <ChartBarBig className="h-4 w-4" />
        Por cliente
      </>
    ),
  },
];

export function CarteiraPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });

  // null até o primeiro "Consultar": a tela não consulta o ERP sozinha ao abrir
  const [periodo, setPeriodo] = React.useState<CarteiraFiltro | null>(null);
  const [buscaInput, setBuscaInput] = React.useState("");
  const [situacao, setSituacao] = React.useState<SituacaoFiltro>("todos");
  const [visao, setVisao] = React.useState<Visao>("tabela");
  const [itemMateriais, setItemMateriais] = React.useState<CarteiraItemResponse | null>(null);
  const [imprimindo, setImprimindo] = React.useState(false);
  const busca = useDebounce(buscaInput, 300);

  const carteira = useCarteiraQuery(periodo ?? SEM_PERIODO, !!periodo && periodoValido(periodo));
  const exportar = useExportarCarteiraMutation();

  // início da consulta em andamento, para o contador do carregamento
  const [desde, setDesde] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (carteira.isFetching) setDesde(Date.now());
  }, [carteira.isFetching]);

  const dados = carteira.data;

  const itens = React.useMemo(() => filtrarCarteira(dados?.itens ?? [], busca, situacao), [dados, busca, situacao]);

  React.useEffect(() => setPage(0), [periodo, busca, situacao, setPage]);

  const contagens: Record<SituacaoFiltro, number> = {
    todos: dados?.resumo.itens ?? 0,
    atrasados: dados?.resumo.atrasados ?? 0,
    "falta-material": dados?.resumo.comMaterialPendente ?? 0,
  };

  const temFiltroTabela = !!buscaInput || situacao !== "todos";
  const filtrosTabelaDescricao = [
    buscaInput.trim() && `busca "${buscaInput.trim()}"`,
    situacao !== "todos" && SITUACOES.find((s) => s.id === situacao)?.label.toLowerCase(),
  ]
    .filter(Boolean)
    .join(" · ");

  const handlePlanilha = () =>
    periodo &&
    exportar.mutate(periodo, {
      onSuccess: () => toast.success("Planilha gerada", "O download da carteira começou."),
      onError: (err) => toast.error("Não foi possível exportar", getApiErrorMessage(err, "Tente novamente.")),
    });
  const limparFiltrosTabela = () => {
    setBuscaInput("");
    setSituacao("todos");
  };
  const encerrarImpressao = React.useCallback(() => setImprimindo(false), []);
  const fecharMateriais = React.useCallback(() => setItemMateriais(null), []);

  return (
    <PageShell>
      <PageHeader
        icon={ClipboardList}
        title="Carteira de pedidos"
        description="Pedidos pendentes com a etapa da OP e os materiais que faltam, direto do ERP"
        actions={
          <CarteiraAcoes
            consultando={carteira.isFetching}
            podeAtualizar={!!periodo && periodoValido(periodo)}
            podeExportar={!!dados && !carteira.isFetching}
            exportandoPlanilha={exportar.isPending}
            imprimindo={imprimindo}
            onAtualizar={() => carteira.atualizar()}
            onPlanilha={handlePlanilha}
            onPdf={() => setImprimindo(true)}
          />
        }
      />

      <CarteiraPeriodoFiltro periodo={periodo} onConsultar={setPeriodo} consultadoEm={dados?.consultadoEm} />

      {!periodo ? (
        <CarteiraAguardando />
      ) : carteira.isFetching && !dados ? (
        <CarteiraCarregando desde={desde} />
      ) : carteira.isError && !dados ? (
        <CarteiraErro
          mensagem={getApiErrorMessage(carteira.error, "O ERP não respondeu. Tente novamente em instantes.")}
          onTentarNovamente={() => carteira.refetch()}
        />
      ) : (
        dados && (
          <>
            {carteira.isFetching && <CarteiraAtualizando />}

            <CarteiraResumoCards resumo={dados.resumo} />

            {/* Visão + filtros locais (valem para a tabela e para o gráfico) */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Segmented<Visao>
                label="Visualização"
                value={visao}
                onChange={setVisao}
                options={VISOES}
                stretch
                className="w-full shrink-0 lg:w-auto"
              />
              <div className="min-w-0 flex-1">
                <CarteiraFiltrosTabela
                  busca={buscaInput}
                  onBuscaChange={setBuscaInput}
                  situacao={situacao}
                  onSituacaoChange={setSituacao}
                  contagens={contagens}
                  onLimpar={limparFiltrosTabela}
                />
              </div>
            </div>

            {visao === "clientes" ? (
              <CarteiraClientesChart itens={itens} />
            ) : (
              <CarteiraTable
                data={paginate(itens, page, size)}
                emptyMessage={
                  temFiltroTabela
                    ? "Nenhum pedido com esses filtros. Tente limpar a busca ou a situação."
                    : "Nenhum pedido pendente no período."
                }
                onPageChange={setPage}
                onSizeChange={(newSize) => {
                  setSize(newSize);
                  setPage(0);
                }}
                onVerMateriais={setItemMateriais}
              />
            )}
          </>
        )
      )}

      <MateriaisPendentesDialog item={itemMateriais} onClose={fecharMateriais} />

      {imprimindo && dados && (
        <CarteiraRelatorioImpressao
          carteira={dados}
          itens={itens}
          filtrosTabela={filtrosTabelaDescricao}
          onDone={encerrarImpressao}
        />
      )}
    </PageShell>
  );
}
