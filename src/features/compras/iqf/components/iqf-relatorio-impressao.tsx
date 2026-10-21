import * as React from "react";
import { createPortal } from "react-dom";
import type { IqfFornecedorResponse, IqfResponse } from "../types";
import {
  FAIXA_CRITERIO,
  FAIXA_LABELS,
  FAIXA_TONE,
  formatData,
  formatMes,
  diasTexto,
  formatPercentual,
  tomDoMes,
} from "../lib/classificacao";
import { IqfMensalChart } from "./iqf-mensal-chart";

export interface IqfRelatorioImpressaoProps {
  iqf: IqfResponse;
  fornecedores: IqfFornecedorResponse[];
  /** Descrição dos filtros de tabela aplicados (busca/faixa), se houver. */
  filtrosTabela?: string;
  /** Chamado depois que o diálogo de impressão fecha. */
  onDone: () => void;
}

const th = "border-b border-border px-2 py-1.5 text-left font-semibold";
const td = "border-b border-border px-2 py-1 tabular-nums";

/**
 * Relatório do IQF para "Salvar como PDF": renderizado fora do app (#print-root),
 * visível só na impressão (ver @media print em app.css), sempre no tema claro.
 */
export function IqfRelatorioImpressao({ iqf, fornecedores, filtrosTabela, onDone }: IqfRelatorioImpressaoProps) {
  const [root] = React.useState(() => {
    const el = document.createElement("div");
    el.id = "print-root";
    return el;
  });

  React.useEffect(() => {
    document.body.appendChild(root);
    const finish = () => onDone();
    window.addEventListener("afterprint", finish);
    // dois frames: o gráfico (SVG de largura fixa) já está no DOM quando o diálogo abre
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => window.print());
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", finish);
      root.remove();
    };
  }, [root, onDone]);

  const faixa = iqf.classificacao?.faixa;
  const indicadores = [
    { label: "IQF geral", value: formatPercentual(iqf.percentualNoPrazo), tone: faixa ? FAIXA_TONE[faixa].text : "" },
    { label: "Classificação", value: faixa ? FAIXA_LABELS[faixa] : "Sem avaliação", tone: faixa ? FAIXA_TONE[faixa].text : "" },
    { label: "Entregas avaliadas", value: String(iqf.entregasAvaliadas), tone: "" },
    { label: "No prazo", value: String(iqf.entregasNoPrazo), tone: "text-success" },
    { label: "Atrasadas", value: String(iqf.entregasAtrasadas), tone: "text-danger" },
  ];

  return createPortal(
    <div className="bg-white p-2 text-[11px] text-foreground">
      <header className="flex items-end justify-between border-b-2 border-primary pb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">LANX · Compras</p>
          <h1 className="font-display text-xl font-semibold">IQF de fornecedores (prazo de entrega)</h1>
          <p className="text-muted-foreground">
            Entrega prevista de {formatData(iqf.dataInicio)} a {formatData(iqf.dataFim)} ·{" "}
            {iqf.rateios.length ? `Rateios: ${iqf.rateios.join(", ")}` : "Todos os rateios"} · Tolerância de
            atraso: {diasTexto(iqf.toleranciaDias)}
            {filtrosTabela ? ` · ${filtrosTabela}` : ""}
          </p>
        </div>
        <p className="text-right text-[10px] text-muted-foreground">
          Gerado em {new Date().toLocaleString("pt-BR")}
          <br />
          {FAIXA_CRITERIO}
        </p>
      </header>

      <section className="mt-3 grid grid-cols-5 gap-2">
        {indicadores.map((i) => (
          <div key={i.label} className="rounded-md border border-border px-3 py-2">
            <p className="text-[10px] text-muted-foreground">{i.label}</p>
            <p className={`font-display text-base font-semibold tabular-nums ${i.tone}`}>{i.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 break-inside-avoid">
        <h2 className="mb-1 font-semibold">
          IQF mês a mês · meta mensal {iqf.metaMensal}%
        </h2>
        <IqfMensalChart meses={iqf.meses} width={1000} height={260} showValues meta={iqf.metaMensal} />
        <table className="mt-2 w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Mês</th>
              {iqf.meses.map((m) => (
                <th key={m.mes} className={`${th} text-right`}>
                  {formatMes(m.mes)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={td}>IQF</td>
              {iqf.meses.map((m) => (
                <td
                  key={m.mes}
                  className={`${td} text-right font-semibold ${tomDoMes(m, true)}`}
                >
                  {formatPercentual(m.percentualNoPrazo)}
                </td>
              ))}
            </tr>
            <tr>
              <td className={td}>Avaliadas</td>
              {iqf.meses.map((m) => (
                <td key={m.mes} className={`${td} text-right`}>
                  {m.entregasAvaliadas}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-4">
        <h2 className="mb-1 font-semibold">Fornecedores ({fornecedores.length}) · piores primeiro</h2>
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className={th}>Fornecedor</th>
              <th className={`${th} text-right`}>Avaliadas</th>
              <th className={`${th} text-right`}>No prazo</th>
              <th className={`${th} text-right`}>Atrasadas</th>
              <th className={`${th} text-right`}>IQF</th>
              <th className={th}>Classificação</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f) => (
              <tr key={f.fornecedorId} className="break-inside-avoid">
                <td className={td}>{f.fornecedor}</td>
                <td className={`${td} text-right`}>{f.entregasAvaliadas}</td>
                <td className={`${td} text-right`}>{f.entregasNoPrazo}</td>
                <td className={`${td} text-right`}>{f.entregasAtrasadas}</td>
                <td
                  className={`${td} text-right font-semibold ${f.classificacao ? FAIXA_TONE[f.classificacao.faixa].text : ""}`}
                >
                  {formatPercentual(f.percentualNoPrazo)}
                </td>
                <td className={td}>{f.classificacao ? FAIXA_LABELS[f.classificacao.faixa] : "Não avaliado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>,
    root
  );
}
