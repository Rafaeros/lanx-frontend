import { CalendarCheck, CalendarX, PackageCheck } from "lucide-react";
import type { IqfFiltro, IqfFornecedorResponse } from "../types";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog } from "@/shared/components/ui/dialog";
import { useIqfFornecedorQuery } from "../hooks/use-iqf";
import {
  FAIXA_BADGE,
  FAIXA_LABELS,
  FAIXA_TONE,
  META_FORNECEDOR,
  diasTexto,
  formatData,
  formatPercentual,
} from "../lib/classificacao";
import { IqfMensalPainel } from "./iqf-mensal-painel";

export interface IqfFornecedorDialogProps {
  /** Fornecedor da linha clicada; `null` fecha o modal. */
  fornecedor: IqfFornecedorResponse | null;
  /** Mesmos período e rateios da tela, para o gráfico bater com a tabela. */
  filtro: IqfFiltro;
  onClose: () => void;
}

/** IQF de um único fornecedor, mês a mês, com os filtros atuais da tela. */
export function IqfFornecedorDialog({ fornecedor, filtro, onClose }: IqfFornecedorDialogProps) {
  const query = useIqfFornecedorQuery(fornecedor?.fornecedorId ?? null, filtro);
  const iqf = query.data;
  const faixa = iqf?.classificacao?.faixa ?? fornecedor?.classificacao?.faixa;
  const percentual = iqf ? iqf.percentualNoPrazo : fornecedor?.percentualNoPrazo;

  const contexto = [
    `Entrega prevista de ${formatData(filtro.dataInicio)} a ${formatData(filtro.dataFim)}`,
    filtro.rateios.length ? `Rateios: ${filtro.rateios.join(", ")}` : "Todos os rateios",
    `Tolerância de atraso: ${diasTexto(filtro.toleranciaDias)}`,
  ].join(" · ");

  const indicadores = [
    { label: "Avaliadas", value: iqf?.entregasAvaliadas ?? fornecedor?.entregasAvaliadas, icon: PackageCheck, tone: "bg-info/10 text-info" },
    { label: "No prazo", value: iqf?.entregasNoPrazo ?? fornecedor?.entregasNoPrazo, icon: CalendarCheck, tone: "bg-success/10 text-success" },
    { label: "Atrasadas", value: iqf?.entregasAtrasadas ?? fornecedor?.entregasAtrasadas, icon: CalendarX, tone: "bg-danger/10 text-danger" },
  ];

  return (
    <Dialog
      open={!!fornecedor}
      onClose={onClose}
      title={fornecedor?.fornecedor ?? ""}
      description={contexto}
      maxWidth="5xl"
    >
      {fornecedor && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">IQF do fornecedor</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "font-display text-2xl font-semibold tabular-nums",
                    faixa ? FAIXA_TONE[faixa].text : "text-foreground"
                  )}
                >
                  {formatPercentual(percentual)}
                </span>
                {faixa ? (
                  <Badge variant={FAIXA_BADGE[faixa]}>{FAIXA_LABELS[faixa]}</Badge>
                ) : (
                  <Badge variant="secondary">Não avaliado</Badge>
                )}
              </div>
              {percentual != null && (
                <p className={cn("mt-1 text-xs font-medium", percentual >= META_FORNECEDOR ? "text-success" : "text-danger")}>
                  Meta {META_FORNECEDOR}%: {percentual >= META_FORNECEDOR ? "atingida" : "abaixo"}
                </p>
              )}
            </div>
            {indicadores.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">{value ?? "-"}</p>
                </div>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", tone)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          <IqfMensalPainel
            meta={iqf?.metaMensal ?? META_FORNECEDOR}
            meses={query.isError ? [] : (iqf?.meses ?? [])}
            isLoading={query.isLoading}
            emptyMessage={
              query.isError
                ? getApiErrorMessage(query.error, "Não foi possível carregar o IQF do fornecedor.")
                : "Nenhuma entrega avaliada deste fornecedor no período."
            }
          />
        </div>
      )}
    </Dialog>
  );
}
