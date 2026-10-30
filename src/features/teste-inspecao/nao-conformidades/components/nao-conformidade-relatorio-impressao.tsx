import type { PageResult } from "@/shared/types";
import { PrintReport, PrintSection, printTd, printTh, type PrintStat } from "@/shared/components/print";
import { formatDateBR } from "@/shared/lib/utils";
import type { NaoConformidadeFiltro, NaoConformidadeGrupo, NaoConformidadeIndicadores, NaoConformidadeResponse } from "../types";
import { formatMes, formatPercentual, formatQuantidade } from "../lib/formato";
import { NaoConformidadeGrupoGrafico } from "./nao-conformidade-grupo-chart";
import { NaoConformidadeParetoGrafico, PARETO_CORTE, tiposVitais } from "./nao-conformidade-pareto-chart";
import { NaoConformidadeMensalGrafico, resumoMensal } from "./nao-conformidade-mensal-chart";

export interface NaoConformidadeRelatorioImpressaoProps {
  indicadores: NaoConformidadeIndicadores;
  /** Registros do filtro (período + busca), até o limite pedido à API. */
  registros: PageResult<NaoConformidadeResponse>;
  filtro: NaoConformidadeFiltro;
  onDone: () => void;
}

/** Largura útil de uma página A4 paisagem com 10mm de margem (~1000px). */
const LARGURA = 1000;
const MEIA_LARGURA = 490;

function TabelaGrupos({ coluna, grupos, acumulado }: { coluna: string; grupos: NaoConformidadeGrupo[]; acumulado?: boolean }) {
  return (
    <table className="mt-1 w-full border-collapse">
      <thead className="bg-muted">
        <tr>
          <th className={printTh}>{coluna}</th>
          <th className={`${printTh} text-right`}>Registros</th>
          <th className={`${printTh} text-right`}>Qtd não conforme</th>
          <th className={`${printTh} text-right`}>% do total</th>
          {acumulado && <th className={`${printTh} text-right`}>% acumulado</th>}
        </tr>
      </thead>
      <tbody>
        {grupos.map((g) => (
          <tr key={g.nome} className="break-inside-avoid">
            <td className={printTd}>{g.nome}</td>
            <td className={`${printTd} text-right`}>{g.registros}</td>
            <td className={`${printTd} text-right font-semibold`}>{formatQuantidade(g.quantidade)}</td>
            <td className={`${printTd} text-right`}>{formatPercentual(g.percentual)}</td>
            {acumulado && (
              <td
                className={`${printTd} text-right ${(g.percentualAcumulado ?? 0) <= PARETO_CORTE ? "font-semibold text-danger" : ""}`}
              >
                {formatPercentual(g.percentualAcumulado)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function periodo(filtro: NaoConformidadeFiltro) {
  if (filtro.dataInicio && filtro.dataFim) return `Período de ${formatDateBR(filtro.dataInicio)} a ${formatDateBR(filtro.dataFim)}`;
  if (filtro.dataInicio) return `A partir de ${formatDateBR(filtro.dataInicio)}`;
  if (filtro.dataFim) return `Até ${formatDateBR(filtro.dataFim)}`;
  return "Todo o período";
}

/**
 * Relatório de não conformidades para "Salvar como PDF": indicadores, gráficos por departamento,
 * cliente e tipo (Pareto), evolução mensal e a lista de registros, no padrão da carteira e do IQF.
 */
export function NaoConformidadeRelatorioImpressao({
  indicadores: ind,
  registros,
  filtro,
  onDone,
}: NaoConformidadeRelatorioImpressaoProps) {
  const departamento = ind.porDepartamento[0];
  const tipo = ind.porTipo[0];
  const vitais = tiposVitais(ind.porTipo);
  const { media, pior } = resumoMensal(ind.meses);
  const busca = filtro.busca?.trim();

  const stats: PrintStat[] = [
    { label: "Quantidade não conforme", value: formatQuantidade(ind.quantidadeNaoConforme), tone: "text-danger" },
    { label: "Registros", value: String(ind.registros) },
    { label: "OPs afetadas", value: String(ind.opsAfetadas) },
    { label: "Taxa de não conformidade", value: formatPercentual(ind.percentualNaoConforme), tone: "text-warning" },
    { label: "Departamento com mais", value: departamento ? `${departamento.nome} (${formatPercentual(departamento.percentual)})` : "-" },
    { label: "Principal não conformidade", value: tipo ? `${tipo.nome} (${formatPercentual(tipo.percentual)})` : "-" },
  ];

  return (
    <PrintReport
      kicker="LANX · Teste e Inspeção"
      title="Não conformidades"
      subtitle={`${periodo(filtro)} · pela data da não conformidade`}
      meta={
        <>
          Taxa = peças não conformes ÷ quantidade das OPs afetadas
          <br />
          {formatQuantidade(ind.quantidadeNaoConforme)} de {formatQuantidade(ind.quantidadeOps)} peças
        </>
      }
      stats={stats}
      onDone={onDone}
    >
      <div className="grid grid-cols-2 gap-4">
        <PrintSection title={`Por departamento (${ind.porDepartamento.length})`} keepTogether>
          <NaoConformidadeGrupoGrafico grupos={ind.porDepartamento} total={ind.quantidadeNaoConforme} cor="var(--primary)" width={MEIA_LARGURA} />
          <TabelaGrupos coluna="Departamento" grupos={ind.porDepartamento} />
        </PrintSection>
        <PrintSection title={`Por cliente (${ind.porCliente.length})`} keepTogether>
          <NaoConformidadeGrupoGrafico grupos={ind.porCliente} total={ind.quantidadeNaoConforme} cor="var(--info)" width={MEIA_LARGURA} />
          <TabelaGrupos coluna="Cliente" grupos={ind.porCliente} />
        </PrintSection>
      </div>

      <PrintSection
        keepTogether
        title={
          <>
            Por não conformidade (Pareto)
            {vitais > 0 && (
              <span className="font-normal text-muted-foreground">
                {" "}
                · {vitais} {vitais === 1 ? "tipo concentra" : "tipos concentram"} {PARETO_CORTE}% ou mais das peças (em
                vermelho)
              </span>
            )}
          </>
        }
      >
        <NaoConformidadeParetoGrafico tipos={ind.porTipo} total={ind.quantidadeNaoConforme} width={LARGURA} height={280} />
        <TabelaGrupos coluna="Não conformidade" grupos={ind.porTipo} acumulado />
      </PrintSection>

      <PrintSection
        keepTogether
        title={
          <>
            Mês a mês
            <span className="font-normal text-muted-foreground">
              {" "}
              · média de {formatQuantidade(media)} peças por mês
              {pior && ` · pior mês: ${formatMes(pior.mes, "long")} (${formatQuantidade(pior.quantidade)})`}
            </span>
          </>
        }
      >
        <NaoConformidadeMensalGrafico meses={ind.meses} width={LARGURA} height={220} />
        <table className="mt-2 w-full border-collapse">
          <thead>
            <tr>
              <th className={printTh}>Mês</th>
              {ind.meses.map((m) => (
                <th key={m.mes} className={`${printTh} text-right`}>
                  {formatMes(m.mes)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={printTd}>Qtd não conforme</td>
              {ind.meses.map((m) => (
                <td key={m.mes} className={`${printTd} text-right font-semibold ${m.quantidade > 0 ? "text-danger" : ""}`}>
                  {formatQuantidade(m.quantidade)}
                </td>
              ))}
            </tr>
            <tr>
              <td className={printTd}>Registros</td>
              {ind.meses.map((m) => (
                <td key={m.mes} className={`${printTd} text-right`}>
                  {m.registros}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </PrintSection>

      <PrintSection
        className="break-before-page"
        title={
          <>
            Registros ({registros.items.length}
            {registros.totalElements > registros.items.length ? ` de ${registros.totalElements}` : ""})
            {busca && <span className="font-normal text-muted-foreground"> · busca “{busca}”</span>}
            {registros.totalElements > registros.items.length && (
              <span className="font-normal text-danger"> · lista completa na planilha Excel</span>
            )}
          </>
        }
      >
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className={printTh}>Data</th>
              <th className={printTh}>OP</th>
              <th className={printTh}>Descrição</th>
              <th className={printTh}>Cliente</th>
              <th className={printTh}>Data entrega</th>
              <th className={`${printTh} text-right`}>Qtd OP</th>
              <th className={`${printTh} text-right`}>Qtd não conforme</th>
              <th className={printTh}>Não conformidade</th>
              <th className={printTh}>Departamento</th>
              <th className={printTh}>Operador</th>
            </tr>
          </thead>
          <tbody>
            {registros.items.map((nc) => {
              const op = nc.ordemDeProducao;
              return (
                <tr key={nc.id} className="break-inside-avoid">
                  <td className={`${printTd} whitespace-nowrap`}>{formatDateBR(nc.dataNaoConformidade)}</td>
                  <td className={`${printTd} whitespace-nowrap font-medium`}>{op?.codigo ?? "-"}</td>
                  <td className={printTd}>{op?.materialCodigo ?? "-"}</td>
                  <td className={printTd}>{op?.clienteNome ?? "-"}</td>
                  <td className={`${printTd} whitespace-nowrap`}>{formatDateBR(op?.previsao)}</td>
                  <td className={`${printTd} text-right`}>{op ? formatQuantidade(op.quantidade) : "-"}</td>
                  <td className={`${printTd} text-right font-semibold text-danger`}>{formatQuantidade(nc.quantidadeNaoConforme)}</td>
                  <td className={printTd}>{nc.tipo?.nome ?? "-"}</td>
                  <td className={printTd}>{nc.departamento?.nome ?? "-"}</td>
                  <td className={printTd}>{nc.operador?.nome ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PrintSection>
    </PrintReport>
  );
}
