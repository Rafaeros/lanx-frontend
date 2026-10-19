import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { IqfMesResponse } from "@/shared/api/schema";
import { Badge } from "@/shared/components/ui/badge";
import { FAIXA_BADGE, FAIXA_LABELS, formatPercentual, formatMes, tomDoMes } from "../lib/classificacao";

interface Ponto extends IqfMesResponse {
  rotulo: string;
  valor: number | null;
}

function TooltipMes({ active, payload, meta }: TooltipContentProps<number, string> & { meta?: number }) {
  const ponto = active ? (payload?.[0]?.payload as Ponto | undefined) : undefined;
  if (!ponto) return null;
  const faixa = ponto.classificacao?.faixa;
  return (
    <div className="min-w-48 rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-foreground first-letter:uppercase">{formatMes(ponto.mes, "long")}</p>
      {ponto.percentualNoPrazo == null ? (
        <p className="mt-1 text-muted-foreground">Sem entregas avaliadas no mês</p>
      ) : (
        <>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="font-display text-lg font-semibold tabular-nums text-foreground">
              {formatPercentual(ponto.percentualNoPrazo)}
            </span>
            {faixa && <Badge variant={FAIXA_BADGE[faixa]}>{FAIXA_LABELS[faixa]}</Badge>}
          </div>
          {meta != null && ponto.atingiuMeta != null && (
            <p className={`mt-1 font-medium ${ponto.atingiuMeta ? "text-success" : "text-danger"}`}>
              {ponto.atingiuMeta
                ? `Meta de ${meta}% atingida`
                : `Abaixo da meta de ${meta}% (−${formatPercentual(meta - ponto.percentualNoPrazo).replace("%", " p.p.")})`}
            </p>
          )}
          <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 text-muted-foreground">
            <dt>Avaliadas</dt>
            <dd className="text-right tabular-nums text-foreground">{ponto.entregasAvaliadas}</dd>
            <dt>No prazo</dt>
            <dd className="text-right tabular-nums text-foreground">{ponto.entregasNoPrazo}</dd>
            <dt>Atrasadas</dt>
            <dd className="text-right tabular-nums text-foreground">{ponto.entregasAtrasadas}</dd>
          </dl>
        </>
      )}
    </div>
  );
}

export interface IqfMensalChartProps {
  meses: IqfMesResponse[];
  /** Largura fixa (impressão/PDF). Sem ela, ocupa o container. */
  width?: number;
  height?: number;
  /** Rótulo com o percentual acima de cada barra (útil no PDF, sem tooltip). */
  showValues?: boolean;
  /**
   * Meta mensal (IQF geral: 97%). Com ela, as barras mostram se o mês atingiu a meta e há uma
   * única linha de referência; sem ela (fornecedor), barras pela faixa A/B/C com as linhas 84%/75%.
   */
  meta?: number;
}

/** IQF mês a mês: uma barra por mês, colorida pela meta (geral) ou pela faixa (fornecedor). */
export function IqfMensalChart({ meses, width, height = 320, showValues, meta }: IqfMensalChartProps) {
  const pontos: Ponto[] = meses.map((m) => ({
    ...m,
    rotulo: formatMes(m.mes, "short"),
    valor: m.percentualNoPrazo ?? null,
  }));
  const animar = width == null;

  const chart = (
    <BarChart
      data={pontos}
      width={width}
      height={height}
      margin={{ top: showValues ? 22 : 12, right: 68, bottom: 4, left: -8 }}
      barCategoryGap={pontos.length > 18 ? "12%" : "28%"}
    >
      <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
      <XAxis
        dataKey="rotulo"
        tickLine={false}
        axisLine={{ stroke: "currentColor", strokeOpacity: 0.25 }}
        tick={{ fill: "currentColor", fontSize: 11 }}
        // no PDF (largura fixa) cabem todos; na tela estreita, rótulos que colidiriam são omitidos
        interval={width != null ? 0 : "preserveStartEnd"}
        minTickGap={12}
      />
      <YAxis
        domain={[0, 100]}
        ticks={[0, 25, 50, 75, 100]}
        tickFormatter={(v: number) => `${v}%`}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 11 }}
        width={48}
      />
      {animar && (
        <Tooltip
          cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
          content={(props) => <TooltipMes {...(props as TooltipContentProps<number, string>)} meta={meta} />}
        />
      )}
      {meta != null && (
        <ReferenceLine
          y={meta}
          className="text-foreground"
          stroke="currentColor"
          strokeDasharray="6 4"
          strokeWidth={1.75}
          label={{ value: `Meta ${meta}%`, position: "right", fill: "currentColor", fontSize: 11, fontWeight: 700 }}
        />
      )}
      {meta == null && (
        <>
          <ReferenceLine
            y={84}
            className="text-success"
            stroke="currentColor"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            label={{ value: "A 84%", position: "right", fill: "currentColor", fontSize: 11, fontWeight: 600 }}
          />
          <ReferenceLine
            y={75}
            className="text-warning"
            stroke="currentColor"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            label={{ value: "B 75%", position: "right", fill: "currentColor", fontSize: 11, fontWeight: 600 }}
          />
        </>
      )}
      <Bar dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={56} minPointSize={(v: unknown) => (v === 0 ? 4 : 0)} isAnimationActive={animar} name="IQF">
        {pontos.map((p) => (
          <Cell
            key={p.mes}
            fill="currentColor"
            className={tomDoMes(p, meta != null)}
          />
        ))}
        {showValues && (
          <LabelList
            dataKey="valor"
            position="top"
            fill="currentColor"
            fontSize={10}
            formatter={(v: unknown) => (typeof v === "number" ? `${Math.round(v)}%` : "")}
          />
        )}
      </Bar>
    </BarChart>
  );

  return (
    <div className="text-muted-foreground" role="img" aria-label={meta != null ? `Gráfico do IQF mensal com a meta de ${meta}%` : "Gráfico do IQF mensal por faixa de classificação"}>
      {width != null ? chart : <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer>}
    </div>
  );
}
