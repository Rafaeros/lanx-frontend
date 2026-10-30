import * as React from "react";
import { useSearchParams } from "react-router";
import { ChartColumnBig, FileSpreadsheet, FileText, Plus, RefreshCw, Search, ShieldAlert, Table2, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { usePagination } from "@/shared/hooks/use-pagination";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog } from "@/shared/components/ui/dialog";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { IntervaloDatasInput, type IntervaloDatas } from "@/shared/components/ui/intervalo-datas";
import { Segmented } from "@/shared/components/ui/segmented";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PageShell } from "@/shared/components/ui/page-shell";
import { useToast } from "@/shared/components/ui/toast";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { PRESETS, periodoDoPreset, presetDoPeriodo } from "@/shared/lib/periodo";
import type { PageResult } from "@/shared/types";
import type { NaoConformidadeFiltro, NaoConformidadeRequest, NaoConformidadeResponse } from "../types";
import {
  useCreateNaoConformidadeMutation,
  useDeleteNaoConformidadeMutation,
  useExportarNaoConformidadesMutation,
  useNaoConformidadeIndicadoresQuery,
  useNaoConformidadesSearchQuery,
  useRelatorioNaoConformidadesMutation,
  useUpdateNaoConformidadeMutation,
} from "../hooks/use-nao-conformidades";
import { NaoConformidadeTable } from "../components/nao-conformidade-table";
import { NaoConformidadeForm } from "../components/nao-conformidade-form";
import { NaoConformidadeDetalhe } from "../components/nao-conformidade-detalhe";
import { NaoConformidadeResumo } from "../components/nao-conformidade-resumo";
import { NaoConformidadePainel } from "../components/nao-conformidade-painel";
import { NaoConformidadeRelatorioImpressao } from "../components/nao-conformidade-relatorio-impressao";
import type { NaoConformidadeFormData } from "../schemas";

const toRequest = (data: NaoConformidadeFormData): NaoConformidadeRequest => ({
  ordemDeProducaoId: data.ordemDeProducaoId,
  tipoNaoConformidadeId: data.tipoNaoConformidadeId,
  departamentoId: data.departamentoId,
  operadorId: data.operadorId || null,
  quantidadeNaoConforme: Number(data.quantidadeNaoConforme.replace(",", ".")),
  dataNaoConformidade: data.dataNaoConformidade,
});

type Visao = "registros" | "graficos";

export function NaoConformidadesPage() {
  const toast = useToast();
  const { page, size, setPage, setSize } = usePagination({ initialSize: 20 });
  const [searchParams, setSearchParams] = useSearchParams();
  const visao: Visao = searchParams.get("visao") === "graficos" ? "graficos" : "registros";
  const setVisao = (v: Visao) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v === "graficos") next.set("visao", "graficos");
        else next.delete("visao");
        return next;
      },
      { replace: true }
    );

  // ano corrente por padrão: o gráfico mensal já abre com todos os meses
  const [periodo, setPeriodo] = React.useState<IntervaloDatas>(() => periodoDoPreset("ano"));
  const periodoInvalido = !periodo.dataInicio || !periodo.dataFim || periodo.dataInicio > periodo.dataFim;
  const [busca, setBusca] = React.useState("");
  const debouncedBusca = useDebounce(busca, 350);

  // cards e gráficos olham só o período; a busca filtra a tabela (e a planilha)
  const filtroPeriodo: NaoConformidadeFiltro = React.useMemo(
    () => ({ dataInicio: periodo.dataInicio, dataFim: periodo.dataFim }),
    [periodo]
  );
  const filtro: NaoConformidadeFiltro = React.useMemo(
    () => ({ ...filtroPeriodo, busca: debouncedBusca }),
    [filtroPeriodo, debouncedBusca]
  );

  // qualquer mudança de filtro volta para a primeira página
  React.useEffect(() => setPage(0), [filtro, setPage]);

  const indicadores = useNaoConformidadeIndicadoresQuery(filtroPeriodo, !periodoInvalido);
  const registros = useNaoConformidadesSearchQuery(filtro, page, size, !periodoInvalido);
  const isFetching = indicadores.isFetching || registros.isFetching;
  const refetch = () => {
    indicadores.refetch();
    registros.refetch();
  };

  const createMutation = useCreateNaoConformidadeMutation();
  const updateMutation = useUpdateNaoConformidadeMutation();
  const deleteMutation = useDeleteNaoConformidadeMutation();
  const exportar = useExportarNaoConformidadesMutation();
  const relatorio = useRelatorioNaoConformidadesMutation();
  // registros carregados para o PDF; com eles o relatório é montado e a impressão abre
  const [impressao, setImpressao] = React.useState<PageResult<NaoConformidadeResponse> | null>(null);
  const encerrarImpressao = React.useCallback(() => setImpressao(null), []);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NaoConformidadeResponse | null>(null);
  const [viewing, setViewing] = React.useState<NaoConformidadeResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<NaoConformidadeResponse | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = React.useCallback((nc: NaoConformidadeResponse) => {
    setEditing(nc);
    setFormOpen(true);
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: NaoConformidadeFormData, files: File[]) => {
    const request = toRequest(formData);
    const onError = (err: unknown) =>
      toast.error("Não foi possível salvar a não conformidade", getApiErrorMessage(err, "Tente novamente."));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: request },
        {
          onSuccess: (nc) => {
            closeForm();
            toast.success("Não conformidade atualizada", nc.ordemDeProducao?.codigo);
          },
          onError,
        }
      );
    } else {
      createMutation.mutate(
        { data: request, files },
        {
          onSuccess: (nc) => {
            closeForm();
            const anexos = nc.anexos?.length ?? 0;
            toast.success(
              "Não conformidade registrada",
              [nc.ordemDeProducao?.codigo, anexos > 0 && `${anexos} ${anexos === 1 ? "anexo" : "anexos"}`]
                .filter(Boolean)
                .join(" · ")
            );
          },
          onError,
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Não conformidade excluída", deleteTarget.ordemDeProducao?.codigo);
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error("Não foi possível excluir a não conformidade", getApiErrorMessage(err, "Tente novamente.")),
    });
  };

  const handlePlanilha = () =>
    exportar.mutate(filtro, {
      onSuccess: () => toast.success("Planilha gerada", "O download das não conformidades começou."),
      onError: (err) => toast.error("Não foi possível exportar", getApiErrorMessage(err, "Tente novamente.")),
    });

  const handlePdf = () =>
    relatorio.mutate(filtro, {
      onSuccess: setImpressao,
      onError: (err) => toast.error("Não foi possível gerar o PDF", getApiErrorMessage(err, "Tente novamente.")),
    });
  const podeExportar = !periodoInvalido && !!registros.data?.totalElements && !!indicadores.data;

  const presetAtivo = presetDoPeriodo(periodo);
  const semRegistrosMsg = indicadores.isError
    ? getApiErrorMessage(indicadores.error, "Não foi possível carregar os indicadores.")
    : "Nenhuma não conformidade no período. Ajuste as datas ou registre uma nova.";

  return (
    <PageShell>
      <PageHeader
        icon={ShieldAlert}
        title="Não conformidades"
        description="Peças não conformes das OPs por departamento, tipo e cliente"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refetch} disabled={isFetching || periodoInvalido} className="h-9">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <PermissionGate permission="teste-inspecao.nao-conformidade:exportar">
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlanilha}
                  isLoading={exportar.isPending}
                  disabled={!podeExportar}
                  className="h-9 rounded-r-none"
                  title="Baixar planilha Excel com os registros e os totais por departamento, tipo, cliente e mês"
                >
                  {!exportar.isPending && <FileSpreadsheet className="h-4 w-4 text-success" />}
                  Planilha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePdf}
                  isLoading={relatorio.isPending}
                  disabled={!podeExportar || !!impressao}
                  className="-ml-px h-9 rounded-l-none"
                  title="Gerar relatório em PDF com indicadores e gráficos (use “Salvar como PDF” na janela de impressão)"
                >
                  {!relatorio.isPending && <FileText className="h-4 w-4 text-danger" />}
                  PDF
                </Button>
              </div>
            </PermissionGate>
            <PermissionGate permission="teste-inspecao.nao-conformidade:create">
              <Button variant="primary" size="sm" onClick={openCreate} className="h-9">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nova não conformidade</span>
                <span className="sm:hidden">Nova</span>
              </Button>
            </PermissionGate>
          </>
        }
      />

      {/* Período: vale para os cards, os gráficos, a tabela e a planilha */}
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="min-w-0 space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Período (data da não conformidade)</span>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="overflow-x-auto">
              <Segmented
                label="Período rápido"
                options={PRESETS}
                value={presetAtivo}
                onChange={(id) => setPeriodo(periodoDoPreset(id))}
                stretch
                className="w-full min-w-max md:w-auto"
              />
            </div>
            <IntervaloDatasInput
              value={periodo}
              onChange={setPeriodo}
              invalido={periodoInvalido}
              labelInicio="Não conformidades de"
              labelFim="Não conformidades até"
            />
          </div>
        </div>
        {periodoInvalido ? (
          <p className="text-xs font-medium text-danger">A data inicial precisa ser anterior ou igual à final.</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Taxa de não conformidade = quantidade não conforme ÷ quantidade das OPs afetadas (cada OP contada uma vez).
          </p>
        )}
      </section>

      <NaoConformidadeResumo
        indicadores={periodoInvalido ? undefined : indicadores.data}
        isLoading={indicadores.isLoading}
      />

      {/* Alternância de visão + busca, que só vale para a tabela */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Segmented<Visao>
          label="Visualização"
          value={visao}
          onChange={setVisao}
          stretch
          className="w-full shrink-0 lg:w-auto"
          options={[
            { id: "registros", label: <><Table2 className="h-4 w-4" />Registros</> },
            { id: "graficos", label: <><ChartColumnBig className="h-4 w-4" />Gráficos</> },
          ]}
        />

        {visao === "registros" && (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0 flex-1">
              <Input
                placeholder="Buscar por OP, produto, cliente, tipo ou departamento"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                aria-label="Buscar não conformidades"
                className="h-9"
              />
            </div>
            {busca && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBusca("")}
                className="h-9 shrink-0 text-muted-foreground"
                title="Limpar busca"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Limpar</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {visao === "registros" ? (
        <NaoConformidadeTable
          data={periodoInvalido ? null : registros.data}
          isLoading={registros.isLoading}
          emptyMessage={busca ? "Nenhuma não conformidade com essa busca no período." : semRegistrosMsg}
          onPageChange={setPage}
          onSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
          onView={setViewing}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      ) : (
        <NaoConformidadePainel
          indicadores={periodoInvalido ? undefined : indicadores.data}
          isLoading={indicadores.isLoading}
          emptyMessage={semRegistrosMsg}
        />
      )}
      <Dialog
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Editar não conformidade" : "Nova não conformidade"}
        description={editing ? "Os anexos não mudam na edição." : undefined}
        maxWidth="2xl"
      >
        <NaoConformidadeForm
          key={editing?.id ?? "new"}
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Dialog>

      <Dialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={`Não conformidade ${viewing?.ordemDeProducao?.codigo ?? ""}`.trim()}
        maxWidth="2xl"
      >
        {viewing && <NaoConformidadeDetalhe id={viewing.id} />}
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Excluir não conformidade"
        description="O registro sai da lista e da planilha. Os anexos ficam guardados no servidor."
        confirmLabel="Excluir"
      >
        <p className="text-sm font-bold text-foreground">
          {deleteTarget?.ordemDeProducao?.codigo} · {deleteTarget?.tipo?.nome}
        </p>
      </ConfirmDialog>

      {impressao && indicadores.data && (
        <NaoConformidadeRelatorioImpressao
          indicadores={indicadores.data}
          registros={impressao}
          filtro={filtro}
          onDone={encerrarImpressao}
        />
      )}
    </PageShell>
  );
}
