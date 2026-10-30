import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { NaoConformidadeGrupo } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { comOutros, formatPercentual, formatQuantidade, truncar } from "../lib/formato";

const LIMITE = 12;
const CORTE_PARETO = 80;

function TooltipTipo({ active, payload }: TooltipContentProps<number, string>) {
  const g = active ? (payload?.[0]?.payload as NaoConformidadeGrupo | undefined) : undefined;
  if (!g) return null;
  return (
    <div className="min-w-52 max-w-72 rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{g.nome}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums text-foreground">
        {formatQuantidade(g.quantidade)} <span className="text-xs font-normal text-muted-foreground">peças</span>
      </p>
      <dl className="mt-1 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 text-muted-foreground">
        <dt>Do total</dt>
        <dd className="text-right tabular-nums text-foreground">{formatPercentual(g.percentual)}</dd>
        <dt>Acumulado</dt>
        <dd className="text-right tabular-nums text-foreground">{formatPercentual(g.percentualAcumulado)}</dd>
        <dt>Registros</dt>
        <dd className="text-right tabular-nums text-foreground">{g.registros}</dd>
      </dl>
    </div>
  );
}

/** Só o gráfico de Pareto. `width` fixa a largura (impressão/PDF: sem animação nem tooltip). */
export function NaoConformidadeParetoGrafico({
  tipos,
  total,
  width,
  height = 340,
}: {
  tipos: NaoConformidadeGrupo[];
  total: number;
  width?: number;
  height?: number;
}) {
  const dados = comOutros(tipos, LIMITE, total);
  const largoTela = useMediaQuery("(min-width: 640px)");
  const largo = width != null || largoTela;
  const tela = width == null;

  const chart = (
    <ComposedChart data={dados} width={width} height={height} margin={{ top: 16, right: 8, bottom: 4, left: -8 }} barCategoryGap="22%">
      <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
      <XAxis
        dataKey="nome"
        interval={0}
        angle={-30}
        textAnchor="end"
        height={largo ? 80 : 64}
        tickLine={false}
        axisLine={{ stroke: "currentColor", strokeOpacity: 0.25 }}
        tick={{ fill: "currentColor", fontSize: 11 }}
        tickFormatter={(v: string) => truncar(v, largo ? 18 : 10)}
      />
      <YAxis
        yAxisId="qtd"
        allowDecimals={false}
        tickFormatter={(v: number) => formatQuantidade(v)}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 11 }}
        width={48}
      />
      <YAxis
        yAxisId="pct"
        orientation="right"
        domain={[0, 100]}
        ticks={[0, 25, 50, 80, 100]}
        tickFormatter={(v: number) => `${v}%`}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 11 }}
        width={44}
      />
      {tela && (
        <Tooltip
          cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
          content={(props) => <TooltipTipo {...(props as TooltipContentProps<number, string>)} />}
        />
      )}
      <ReferenceLine yAxisId="pct" y={CORTE_PARETO} stroke="currentColor" strokeDasharray="6 4" strokeOpacity={0.6} />
      <Bar yAxisId="qtd" dataKey="quantidade" name="Quantidade" fill="var(--warning)" radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive={tela}>
        {!tela && (
          <LabelList
            dataKey="quantidade"
            position="top"
            fill="currentColor"
            fontSize={10}
            formatter={(v: unknown) => (typeof v === "number" ? formatQuantidade(v) : "")}
          />
        )}
      </Bar>
      <Line
        yAxisId="pct"
        type="monotone"
        dataKey="percentualAcumulado"
        name="% acumulado"
        stroke="var(--danger)"
        strokeWidth={2}
        dot={{ r: 3, fill: "var(--danger)" }}
        isAnimationActive={tela}
      />
    </ComposedChart>
  );

  return (
    <div className="text-muted-foreground" role="img" aria-label="Gráfico de Pareto da quantidade por tipo de não conformidade">
      {tela ? <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer> : chart}
    </div>
  );
}

/** Quantos tipos, do maior para o menor, somam 80% das peças (os "poucos vitais"). */
export function tiposVitais(tipos: NaoConformidadeGrupo[]): number {
  return tipos.findIndex((t) => (t.percentualAcumulado ?? 0) >= CORTE_PARETO) + 1;
}

export const PARETO_CORTE = CORTE_PARETO;

/**
 * Card do Pareto dos tipos: barras com a quantidade (maior primeiro) e a linha do % acumulado.
 * Os tipos até a linha de 80% são os poucos que concentram a maior parte das peças.
 */
export function NaoConformidadeParetoChart({ tipos, total }: { tipos: NaoConformidadeGrupo[]; total: number }) {
  const vitais = tiposVitais(tipos);

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Quantidade por não conformidade (Pareto)</h3>
            <p className="text-xs text-muted-foreground">
              {tipos.length} {tipos.length === 1 ? "tipo" : "tipos"} no período
              {vitais > 0 &&
                ` · ${vitais} ${vitais === 1 ? "tipo concentra" : "tipos concentram"} ${CORTE_PARETO}% ou mais das peças`}
            </p>
          </div>
          <ParetoLegenda />
        </div>
        {tipos.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Sem registros no período.</p>
        ) : (
          <NaoConformidadeParetoGrafico tipos={tipos} total={total} />
        )}
      </CardContent>
    </Card>
  );
}

export function ParetoLegenda() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <li className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-warning" aria-hidden />
        Quantidade
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span className="h-0.5 w-3 rounded bg-danger" aria-hidden />% acumulado
      </li>
    </ul>
  );
}
