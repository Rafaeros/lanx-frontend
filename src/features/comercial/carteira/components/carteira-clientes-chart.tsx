import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { CarteiraItemResponse } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { formatCurrency } from "@/shared/lib/utils";
import { agruparPorCliente, type CarteiraPorCliente } from "../lib/carteira";

const LIMITE_CLIENTES = 15;
const ALTURA_LINHA = 34;

const moedaCompacta = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

function percentual(parte: number, total: number) {
  return total > 0 ? `${((parte / total) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "0%";
}

function TooltipCliente({ active, payload, total }: TooltipContentProps<number, string> & { total: number }) {
  const g = active ? (payload?.[0]?.payload as CarteiraPorCliente | undefined) : undefined;
  if (!g) return null;
  return (
    <div className="min-w-56 max-w-80 rounded-lg border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{g.cliente}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums text-foreground">{formatCurrency(g.valorTotal)}</p>
      <p className="text-muted-foreground">{percentual(g.valorTotal, total)} da carteira exibida</p>
      <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 text-muted-foreground">
        <dt className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-danger" />
          Atrasado
        </dt>
        <dd className="text-right tabular-nums text-foreground">{formatCurrency(g.valorAtrasado)}</dd>
        <dt className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-primary" />
          Em dia
        </dt>
        <dd className="text-right tabular-nums text-foreground">{formatCurrency(g.valorEmDia)}</dd>
        <dt>Itens</dt>
        <dd className="text-right tabular-nums text-foreground">
          {g.itens}
          {g.atrasados > 0 && <span className="text-danger"> ({g.atrasados} atrasados)</span>}
        </dd>
      </dl>
    </div>
  );
}

function Legenda() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-danger" />
        Atrasado
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
        Em dia
      </span>
    </div>
  );
}

/**
 * Valor pendente da carteira por cliente (barras horizontais empilhadas: atrasado + em dia).
 * Usa os itens já filtrados na tela, então a busca e a situação também valem aqui.
 */
export function CarteiraClientesChart({ itens }: { itens: CarteiraItemResponse[] }) {
  const grupos = agruparPorCliente(itens, LIMITE_CLIENTES);
  const total = grupos.reduce((s, g) => s + g.valorTotal, 0);
  const totalClientes = grupos.reduce((s, g) => s + g.clientes, 0);
  const largo = useMediaQuery("(min-width: 640px)");
  const maxNome = largo ? 28 : 14;

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Valor pendente por cliente</h2>
            <p className="text-xs text-muted-foreground">
              {totalClientes} {totalClientes === 1 ? "cliente" : "clientes"} · {formatCurrency(total)} a faturar
              {totalClientes > LIMITE_CLIENTES && ` · os ${LIMITE_CLIENTES - 1} maiores e o restante em "Outros"`}
            </p>
          </div>
          <Legenda />
        </div>

        {grupos.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Nenhum pedido para mostrar com esses filtros.</p>
        ) : (
          <div
            className="text-muted-foreground"
            role="img"
            aria-label={`Gráfico de barras com o valor pendente de ${totalClientes} clientes, separando atrasado e em dia`}
          >
            <ResponsiveContainer width="100%" height={grupos.length * ALTURA_LINHA + 32}>
              <BarChart data={grupos} layout="vertical" margin={{ top: 4, right: largo ? 16 : 8, bottom: 4, left: 0 }} barCategoryGap="22%">
                <CartesianGrid horizontal={false} stroke="currentColor" strokeOpacity={0.12} />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => moedaCompacta.format(v)}
                  tickLine={false}
                  axisLine={{ stroke: "currentColor", strokeOpacity: 0.25 }}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="cliente"
                  width={largo ? 190 : 104}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickFormatter={(v: string) => (v.length > maxNome ? `${v.slice(0, maxNome - 1)}…` : v)}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                  content={(props) => <TooltipCliente {...(props as TooltipContentProps<number, string>)} total={total} />}
                />
                {/* atrasado encostado no eixo, para comparar entre clientes; 2px de respiro entre os trechos */}
                <Bar dataKey="valorAtrasado" stackId="valor" name="Atrasado" fill="var(--danger)" stroke="var(--card-bg)" strokeWidth={2} />
                <Bar
                  dataKey="valorEmDia"
                  stackId="valor"
                  name="Em dia"
                  fill="var(--primary)"
                  stroke="var(--card-bg)"
                  strokeWidth={2}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
