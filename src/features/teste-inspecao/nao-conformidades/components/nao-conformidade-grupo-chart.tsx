import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { NaoConformidadeGrupo } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { comOutros, formatPercentual, formatQuantidade, truncar } from "../lib/formato";

const LIMITE = 10;
const ALTURA_LINHA = 34;

function TooltipGrupo({ active, payload }: TooltipContentProps<number, string>) {
  const g = active ? (payload?.[0]?.payload as NaoConformidadeGrupo | undefined) : undefined;
  if (!g) return null;
  return (
    <div className="min-w-48 max-w-72 rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{g.nome}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums text-foreground">
        {formatQuantidade(g.quantidade)} <span className="text-xs font-normal text-muted-foreground">peças</span>
      </p>
      <dl className="mt-1 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 text-muted-foreground">
        <dt>Do total</dt>
        <dd className="text-right tabular-nums text-foreground">{formatPercentual(g.percentual)}</dd>
        <dt>Registros</dt>
        <dd className="text-right tabular-nums text-foreground">{g.registros}</dd>
      </dl>
    </div>
  );
}

export interface NaoConformidadeGrupoGraficoProps {
  grupos: NaoConformidadeGrupo[];
  total: number;
  /** Variável CSS da cor das barras (ex.: "var(--primary)"). */
  cor: string;
  /** Largura fixa (impressão/PDF): sem animação nem tooltip. Sem ela, ocupa o container. */
  width?: number;
  /** Até quantos grupos mostrar; o restante vai para "Outros". */
  limite?: number;
}

/** Só o gráfico: barras horizontais, maior em cima, com o % do total ao lado. */
export function NaoConformidadeGrupoGrafico({ grupos, total, cor, width, limite = LIMITE }: NaoConformidadeGrupoGraficoProps) {
  const dados = comOutros(grupos, limite, total);
  const largoTela = useMediaQuery("(min-width: 640px)");
  const largo = width != null || largoTela;
  const tela = width == null;
  const height = dados.length * ALTURA_LINHA + 32;

  const chart = (
    <BarChart data={dados} width={width} height={height} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 0 }} barCategoryGap="22%">
      <CartesianGrid horizontal={false} stroke="currentColor" strokeOpacity={0.12} />
      <XAxis
        type="number"
        allowDecimals={false}
        tickFormatter={(v: number) => formatQuantidade(v)}
        tickLine={false}
        axisLine={{ stroke: "currentColor", strokeOpacity: 0.25 }}
        tick={{ fill: "currentColor", fontSize: 11 }}
      />
      <YAxis
        type="category"
        dataKey="nome"
        width={largo ? 150 : 96}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 11 }}
        tickFormatter={(v: string) => truncar(v, largo ? 22 : 13)}
      />
      {tela && (
        <Tooltip
          cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
          content={(props) => <TooltipGrupo {...(props as TooltipContentProps<number, string>)} />}
        />
      )}
      <Bar dataKey="quantidade" name="Quantidade" fill={cor} radius={[0, 4, 4, 0]} maxBarSize={26} isAnimationActive={tela}>
        <LabelList
          dataKey="percentual"
          position="right"
          fill="currentColor"
          fontSize={11}
          formatter={(v: unknown) => (typeof v === "number" ? formatPercentual(Math.round(v * 10) / 10) : "")}
        />
      </Bar>
    </BarChart>
  );

  return (
    <div className="text-muted-foreground" role="img" aria-label={`Gráfico de barras de ${grupos.length} grupos`}>
      {tela ? <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer> : chart}
    </div>
  );
}

export interface NaoConformidadeGrupoChartProps {
  titulo: string;
  /** Ex.: "departamentos", para o subtítulo. */
  unidade: string;
  grupos: NaoConformidadeGrupo[];
  total: number;
  cor: string;
}

/** Card da tela: título, subtítulo e o gráfico. */
export function NaoConformidadeGrupoChart({ titulo, unidade, grupos, total, cor }: NaoConformidadeGrupoChartProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{titulo}</h3>
          <p className="text-xs text-muted-foreground">
            {grupos.length} {unidade} com não conformidade
            {grupos.length > LIMITE && ` · os ${LIMITE - 1} maiores e o restante em "Outros"`}
          </p>
        </div>
        {grupos.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Sem registros no período.</p>
        ) : (
          <NaoConformidadeGrupoGrafico grupos={grupos} total={total} cor={cor} />
        )}
      </CardContent>
    </Card>
  );
}
