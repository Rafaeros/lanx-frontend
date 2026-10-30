import { PrintReport, printTd, printTh, type PrintStat } from "@/shared/components/print";
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
import { rateiosTexto } from "@/features/compras/shared/rateios";
import { IqfMensalChart } from "./iqf-mensal-chart";

export interface IqfRelatorioImpressaoProps {
  iqf: IqfResponse;
  fornecedores: IqfFornecedorResponse[];
  /** Descrição dos filtros de tabela aplicados (busca/faixa), se houver. */
  filtrosTabela?: string;
  /** Chamado depois que o diálogo de impressão fecha. */
  onDone: () => void;
}

const th = printTh;
const td = printTd;

/** Relatório do IQF para "Salvar como PDF" (PrintReport), com o gráfico mensal e os fornecedores. */
export function IqfRelatorioImpressao({ iqf, fornecedores, filtrosTabela, onDone }: IqfRelatorioImpressaoProps) {
  const faixa = iqf.classificacao?.faixa;
  const indicadores: PrintStat[] = [
    { label: "IQF geral", value: formatPercentual(iqf.percentualNoPrazo), tone: faixa ? FAIXA_TONE[faixa].text : "" },
    { label: "Classificação", value: faixa ? FAIXA_LABELS[faixa] : "Sem avaliação", tone: faixa ? FAIXA_TONE[faixa].text : "" },
    { label: "Entregas avaliadas", value: String(iqf.entregasAvaliadas) },
    { label: "No prazo", value: String(iqf.entregasNoPrazo), tone: "text-success" },
    { label: "Atrasadas", value: String(iqf.entregasAtrasadas), tone: "text-danger" },
  ];

  return (
    <PrintReport
      kicker="LANX · Qualidade"
      title="IQF de fornecedores (prazo de entrega)"
      subtitle={
        <>
          Entrega prevista de {formatData(iqf.dataInicio)} a {formatData(iqf.dataFim)} · {rateiosTexto(iqf.rateios)} ·
          Tolerância de atraso: {diasTexto(iqf.toleranciaDias)}
          {filtrosTabela ? ` · ${filtrosTabela}` : ""}
        </>
      }
      meta={FAIXA_CRITERIO}
      stats={indicadores}
      onDone={onDone}
    >
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
    </PrintReport>
  );
}
