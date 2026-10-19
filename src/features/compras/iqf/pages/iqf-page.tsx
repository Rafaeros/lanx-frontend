import * as React from "react";
import { useSearchParams } from "react-router";
import { ChartColumnBig, FileSpreadsheet, FileText, Gauge, RefreshCw, Search, Table2, Info, X } from "lucide-react";
import type { FaixaIqf, IqfFiltro, IqfFornecedorResponse } from "@/shared/api/schema";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { paginate } from "@/shared/lib/pagination";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { MultiSelect } from "@/shared/components/ui/multi-select";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { useExportarIqfMutation, useIqfQuery, useIqfRateiosQuery } from "../hooks/use-iqf";
import { IqfResumo } from "../components/iqf-resumo";
import { IqfFornecedoresTable } from "../components/iqf-fornecedores-table";
import { IqfMensalPainel } from "../components/iqf-mensal-painel";
import { IqfRelatorioImpressao } from "../components/iqf-relatorio-impressao";
import { IqfFornecedorDialog } from "../components/iqf-fornecedor-dialog";
import {
  META_FORNECEDOR,
  META_GERAL,
  TOLERANCIA_PADRAO,
  formatData,
  regraPrazo,
} from "../lib/classificacao";
import { ToleranciaInput } from "../components/tolerancia-input";
import { PRESETS, hojeIso, periodoDoPreset, presetDoPeriodo } from "../lib/periodo";

const FAIXAS: (FaixaIqf | "")[] = ["", "A", "B", "C"];
type Visao = "tabela" | "grafico";

/** Piores primeiro (é onde o comprador precisa agir); fornecedores sem avaliação vão para o fim. */
function porIqfCrescente(a: IqfFornecedorResponse, b: IqfFornecedorResponse) {
  const pa = a.percentualNoPrazo ?? Number.POSITIVE_INFINITY;
  const pb = b.percentualNoPrazo ?? Number.POSITIVE_INFINITY;
  return pa - pb || b.entregasAvaliadas - a.entregasAvaliadas || a.fornecedor.localeCompare(b.fornecedor);
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: React.ReactNode }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-9 rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
            value === o.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function IqfPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [searchParams, setSearchParams] = useSearchParams();
  const visao: Visao = searchParams.get("visao") === "grafico" ? "grafico" : "tabela";
  const setVisao = (v: Visao) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v === "grafico") next.set("visao", "grafico");
        else next.delete("visao");
        return next;
      },
      { replace: true }
    );

  // ano corrente por padrão: o gráfico já abre com todos os meses
  const [periodo, setPeriodo] = React.useState(() => periodoDoPreset("ano"));
  const [rateios, setRateios] = React.useState<string[]>([]);
  const [toleranciaInput, setToleranciaInput] = React.useState(TOLERANCIA_PADRAO);
  // espera o usuário parar de clicar no +/- antes de recalcular
  const toleranciaDias = useDebounce(toleranciaInput, 400);
  const [buscaInput, setBuscaInput] = React.useState("");
  const [faixa, setFaixa] = React.useState<FaixaIqf | "">("");
  const [imprimindo, setImprimindo] = React.useState(false);
  const [fornecedorAberto, setFornecedorAberto] = React.useState<IqfFornecedorResponse | null>(null);
  const busca = useDebounce(buscaInput, 300).trim().toLowerCase();

  const hoje = hojeIso();
  const periodoInvalido = !periodo.dataInicio || !periodo.dataFim || periodo.dataInicio > periodo.dataFim;
  const filtro: IqfFiltro = React.useMemo(
    () => ({ ...periodo, rateios: [...rateios].sort(), toleranciaDias }),
    [periodo, rateios, toleranciaDias]
  );
  const iqf = useIqfQuery(filtro, !periodoInvalido);
  const rateiosQuery = useIqfRateiosQuery();
  const exportar = useExportarIqfMutation();

  const fornecedores = React.useMemo(
    () =>
      (iqf.data?.fornecedores ?? [])
        .filter((f) => !faixa || f.classificacao?.faixa === faixa)
        .filter((f) => !busca || f.fornecedor.toLowerCase().includes(busca))
        .sort(porIqfCrescente),
    [iqf.data, faixa, busca]
  );

  // qualquer mudança de filtro volta para a primeira página
  React.useEffect(() => setPage(0), [filtro, faixa, busca, setPage]);

  const temFiltroTabela = !!buscaInput || !!faixa;
  const presetAtivo = presetDoPeriodo(periodo);
  const emptyMessage = iqf.isError
    ? getApiErrorMessage(iqf.error, "Não foi possível calcular o IQF.")
    : temFiltroTabela
      ? "Nenhum fornecedor com esses filtros. Tente limpar a busca ou a faixa."
      : "Nenhuma entrega prevista no período. Ajuste as datas, os rateios ou importe os pedidos na Análise de pedidos.";

  const filtrosTabelaDescricao = [
    buscaInput.trim() && `busca "${buscaInput.trim()}"`,
    faixa && `faixa ${faixa}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const handlePlanilha = () =>
    exportar.mutate(filtro, {
      onSuccess: () => toast.success("Planilha gerada", "O download do IQF começou."),
      onError: (err) => toast.error("Não foi possível exportar", getApiErrorMessage(err, "Tente novamente.")),
    });

  const podeExportar = !periodoInvalido && !!iqf.data && !iqf.isError;
  const encerrarImpressao = React.useCallback(() => setImprimindo(false), []);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Gauge}
        title="IQF de fornecedores"
        description="Índice de qualidade pelo cumprimento dos prazos de entrega dos pedidos"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => iqf.refetch()}
              disabled={iqf.isFetching || periodoInvalido}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 ${iqf.isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="compras.iqf:exportar">
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlanilha}
                  isLoading={exportar.isPending}
                  disabled={!podeExportar}
                  className="h-9 rounded-r-none"
                  title="Baixar planilha Excel com resumo, gráfico mensal e fornecedores"
                >
                  {!exportar.isPending && <FileSpreadsheet className="h-4 w-4 text-success" />}
                  Planilha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImprimindo(true)}
                  disabled={!podeExportar || imprimindo}
                  className="-ml-px h-9 rounded-l-none"
                  title="Gerar relatório em PDF (use “Salvar como PDF” na janela de impressão)"
                >
                  <FileText className="h-4 w-4 text-danger" />
                  PDF
                </Button>
              </div>
            </PermissionGate>
          </>
        }
      />

      {/* Filtros que mudam o cálculo: período, rateios e tolerância de atraso */}
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-muted-foreground">Período (previsão de entrega)</span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="overflow-x-auto">
                <Segmented
                  label="Período rápido"
                  options={PRESETS}
                  value={presetAtivo}
                  onChange={(id) => setPeriodo(periodoDoPreset(id))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  aria-label="Entrega prevista de"
                  value={periodo.dataInicio}
                  max={periodo.dataFim || undefined}
                  onChange={(e) => setPeriodo((p) => ({ ...p, dataInicio: e.target.value }))}
                  className="h-9 w-36 text-xs"
                  error={periodoInvalido ? " " : undefined}
                  showErrorMessage={false}
                />
                <span className="text-xs text-muted-foreground">até</span>
                <Input
                  type="date"
                  aria-label="Entrega prevista até"
                  value={periodo.dataFim}
                  min={periodo.dataInicio || undefined}
                  onChange={(e) => setPeriodo((p) => ({ ...p, dataFim: e.target.value }))}
                  className="h-9 w-36 text-xs"
                  error={periodoInvalido ? " " : undefined}
                  showErrorMessage={false}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 xl:min-w-56 xl:max-w-sm">
            <span className="block text-xs font-medium text-muted-foreground">Rateios</span>
            <MultiSelect
              aria-label="Filtrar por rateios"
              options={rateiosQuery.data ?? []}
              value={rateios}
              onChange={setRateios}
              isLoading={rateiosQuery.isLoading}
              placeholder="Todos os rateios"
              searchPlaceholder="Buscar rateio (ex.: matéria-prima)"
            />
          </div>

          <div className="space-y-1.5">
            <span id="tolerancia-label" className="block text-xs font-medium text-muted-foreground">
              Tolerância de atraso
            </span>
            <ToleranciaInput value={toleranciaInput} onChange={setToleranciaInput} labelledBy="tolerancia-label" />
          </div>
        </div>

        {rateios.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {rateios.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 py-0.5 pl-2.5 pr-1 text-[11px] font-medium text-primary"
              >
                {r}
                <button
                  type="button"
                  aria-label={`Remover rateio ${r}`}
                  onClick={() => setRateios((list) => list.filter((x) => x !== r))}
                  className="cursor-pointer rounded-full p-0.5 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setRateios([])}
              className="cursor-pointer px-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              Limpar rateios
            </button>
          </div>
        )}

        {periodoInvalido ? (
          <p className="text-xs font-medium text-danger">A data inicial precisa ser anterior ou igual à final.</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {regraPrazo(toleranciaInput)} Metas: {META_GERAL}% no geral (por mês) e {META_FORNECEDOR}% por fornecedor.
          </p>
        )}
      </section>

      {!periodoInvalido && periodo.dataFim > hoje && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 px-4 py-3 text-sm text-foreground"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
          <p>
            O período vai até <span className="font-semibold">{formatData(periodo.dataFim)}</span>, depois de hoje (
            {formatData(hoje)}). O IQF é montado dia a dia: entregas previstas para os próximos dias só entram no
            cálculo quando chegarem ou atrasarem.
          </p>
        </div>
      )}

      <IqfResumo iqf={periodoInvalido ? undefined : iqf.data} isLoading={iqf.isLoading} />

      {/* Alternância de visão + filtros que só valem para a tabela de fornecedores */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented<Visao>
          label="Visualização"
          value={visao}
          onChange={setVisao}
          options={[
            { id: "tabela", label: <><Table2 className="h-4 w-4" />Fornecedores</> },
            { id: "grafico", label: <><ChartColumnBig className="h-4 w-4" />Gráfico mensal</> },
          ]}
        />

        {visao === "tabela" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              aria-label="Buscar fornecedor"
              placeholder="Buscar fornecedor"
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="h-9 sm:w-64"
            />
            <Segmented<FaixaIqf | "">
              label="Faixa"
              value={faixa}
              onChange={setFaixa}
              options={FAIXAS.map((f) => ({ id: f, label: f ? `Faixa ${f}` : "Todas" }))}
            />
            {temFiltroTabela && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBuscaInput("");
                  setFaixa("");
                }}
                className="h-9 text-muted-foreground"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        )}
      </div>

      {visao === "tabela" ? (
        <IqfFornecedoresTable
          data={periodoInvalido || iqf.isError ? null : paginate(fornecedores, page, size)}
          isLoading={iqf.isLoading}
          emptyMessage={emptyMessage}
          onPageChange={setPage}
          onSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
          onView={setFornecedorAberto}
        />
      ) : (
        <IqfMensalPainel
          meta={iqf.data?.metaMensal}
          meses={periodoInvalido || iqf.isError ? [] : (iqf.data?.meses ?? [])}
          isLoading={iqf.isLoading}
          emptyMessage={emptyMessage}
        />
      )}

      <IqfFornecedorDialog
        fornecedor={fornecedorAberto}
        filtro={filtro}
        onClose={() => setFornecedorAberto(null)}
      />

      {imprimindo && iqf.data && (
        <IqfRelatorioImpressao
          iqf={iqf.data}
          fornecedores={fornecedores}
          filtrosTabela={filtrosTabelaDescricao}
          onDone={encerrarImpressao}
        />
      )}
    </div>
  );
}
