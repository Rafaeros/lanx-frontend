import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { NaoConformidadeMes } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatMes, formatQuantidade } from "../lib/formato";

interface Ponto extends NaoConformidadeMes {
  rotulo: string;
}

function TooltipMes({ active, payload }: TooltipContentProps<number, string>) {
  const p = active ? (payload?.[0]?.payload as Ponto | undefined) : undefined;
  if (!p) return null;
  return (
    <div className="min-w-44 rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-foreground first-letter:uppercase">{formatMes(p.mes, "long")}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums text-foreground">
        {formatQuantidade(p.quantidade)} <span className="text-xs font-normal text-muted-foreground">peças</span>
      </p>
      <p className="text-muted-foreground">
        {p.registros} {p.registros === 1 ? "registro" : "registros"}
      </p>
    </div>
  );
}

/** Só o gráfico mensal. `width` fixa a largura (impressão/PDF: sem animação nem tooltip). */
export function NaoConformidadeMensalGrafico({
  meses,
  width,
  height = 300,
}: {
  meses: NaoConformidadeMes[];
  width?: number;
  height?: number;
}) {
  const pontos: Ponto[] = meses.map((m) => ({ ...m, rotulo: formatMes(m.mes) }));
  const tela = width == null;

  const chart = (
    <BarChart data={pontos} width={width} height={height} margin={{ top: 22, right: 8, bottom: 4, left: -8 }} barCategoryGap={pontos.length > 18 ? "12%" : "28%"}>
      <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
      <XAxis
        dataKey="rotulo"
        tickLine={false}
        axisLine={{ stroke: "currentColor", strokeOpacity: 0.25 }}
        tick={{ fill: "currentColor", fontSize: 11 }}
        // no PDF (largura fixa) cabem todos; na tela estreita, rótulos que colidiriam são omitidos
        interval={tela ? "preserveStartEnd" : 0}
        minTickGap={12}
      />
      <YAxis
        allowDecimals={false}
        tickFormatter={(v: number) => formatQuantidade(v)}
        tickLine={false}
        axisLine={false}
        tick={{ fill: "currentColor", fontSize: 11 }}
        width={48}
      />
      {tela && (
        <Tooltip
          cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
          content={(props) => <TooltipMes {...(props as TooltipContentProps<number, string>)} />}
        />
      )}
      <Bar dataKey="quantidade" name="Quantidade" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={56} isAnimationActive={tela}>
        <LabelList
          dataKey="quantidade"
          position="top"
          fill="currentColor"
          fontSize={10}
          formatter={(v: unknown) => (typeof v === "number" && v > 0 ? formatQuantidade(v) : "")}
        />
      </Bar>
    </BarChart>
  );

  return (
    <div className="text-muted-foreground" role="img" aria-label="Gráfico da quantidade não conforme por mês">
      {tela ? <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer> : chart}
    </div>
  );
}

/** Média mensal e pior mês do período, para os subtítulos. */
export function resumoMensal(meses: NaoConformidadeMes[]) {
  const total = meses.reduce((s, m) => s + m.quantidade, 0);
  const media = meses.length > 0 ? Math.round((total / meses.length) * 10) / 10 : 0;
  const pior = meses
    .filter((m) => m.registros > 0)
    .reduce<NaoConformidadeMes | null>((a, m) => (!a || m.quantidade > a.quantidade ? m : a), null);
  return { media, pior };
}

/** Card da tela: quantidade não conforme mês a mês, com a média do período e o pior mês. */
export function NaoConformidadeMensalChart({ meses }: { meses: NaoConformidadeMes[] }) {
  const { media, pior } = resumoMensal(meses);
  const comRegistro = meses.some((m) => m.registros > 0);

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">Quantidade não conforme mês a mês</h3>
          <p className="text-xs text-muted-foreground">
            {meses.length} {meses.length === 1 ? "mês" : "meses"} no período · média de {formatQuantidade(media)} peças por mês
            {pior && ` · pior mês: ${formatMes(pior.mes, "long")} (${formatQuantidade(pior.quantidade)})`}
          </p>
        </div>
        {!comRegistro ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Sem registros no período.</p>
        ) : (
          <NaoConformidadeMensalGrafico meses={meses} />
        )}
      </CardContent>
    </Card>
  );
}
