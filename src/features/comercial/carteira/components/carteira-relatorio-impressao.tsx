import { PrintReport, printTd, printTh, type PrintStat } from "@/shared/components/print";
import type { CarteiraItemResponse, CarteiraResponse } from "../types";
import { formatCurrency, formatDateBR, formatNumber } from "@/shared/lib/utils";
import { formatDataHora, materialEmRisco } from "../lib/carteira";

export interface CarteiraRelatorioImpressaoProps {
  carteira: CarteiraResponse;
  /** Itens já filtrados na tela (busca/situação). */
  itens: CarteiraItemResponse[];
  /** Descrição dos filtros da tabela aplicados, se houver. */
  filtrosTabela?: string;
  /** Chamado depois que o diálogo de impressão fecha. */
  onDone: () => void;
}

const th = printTh;
const td = printTd;

/** Carteira para "Salvar como PDF" (PrintReport), com os materiais pendentes sob cada pedido. */
export function CarteiraRelatorioImpressao({ carteira, itens, filtrosTabela, onDone }: CarteiraRelatorioImpressaoProps) {
  const { resumo } = carteira;
  const indicadores: PrintStat[] = [
    { label: "Itens na carteira", value: String(resumo.itens) },
    { label: "Valor total pendente", value: formatCurrency(resumo.valorTotal) },
    { label: "Atrasados", value: String(resumo.atrasados), tone: "text-danger" },
    { label: "Com falta de material", value: String(resumo.comMaterialPendente), tone: "text-warning" },
  ];

  return (
    <PrintReport
      kicker="LANX · Produção"
      title="Carteira de pedidos"
      subtitle={
        <>
          Período de {formatDateBR(carteira.dataInicio)} a {formatDateBR(carteira.dataFim)}
          {filtrosTabela ? ` · ${filtrosTabela}` : ""}
        </>
      }
      meta={
        <>
          Dados do ERP de {formatDataHora(carteira.consultadoEm)}
          <br />
          Em vermelho: previsão vencida ou material previsto para depois da entrega
        </>
      }
      stats={indicadores}
      onDone={onDone}
    >
      <section className="mt-4">
        <h2 className="mb-1 font-semibold">
          Pedidos ({itens.length}){itens.length !== resumo.itens ? ` de ${resumo.itens}` : ""} · por previsão de entrega
        </h2>
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className={th}>Previsão</th>
              <th className={th}>Negociação</th>
              <th className={th}>Ped. cliente</th>
              <th className={th}>OP</th>
              <th className={th}>Cliente</th>
              <th className={th}>Produto</th>
              <th className={th}>Tipo</th>
              <th className={`${th} text-right`}>Pendente</th>
              <th className={`${th} text-right`}>Valor total</th>
              <th className={th}>Etapa atual</th>
            </tr>
          </thead>
          {itens.map((item, index) => (
            <tbody key={`${item.negociacao}-${item.ordem}-${index}`} className="break-inside-avoid">
              <tr>
                <td className={`${td} whitespace-nowrap tabular-nums ${item.atrasado ? "font-semibold text-danger" : ""}`}>
                  {formatDateBR(item.previsao)}
                </td>
                <td className={`${td} tabular-nums`}>{item.negociacao ?? "-"}</td>
                <td className={td}>{item.pedidoCliente || "-"}</td>
                <td className={`${td} whitespace-nowrap font-medium`}>{item.ordem || "-"}</td>
                <td className={td}>{item.cliente || "-"}</td>
                <td className={td}>
                  <span className="font-medium">{item.codigo}</span>
                  {item.descricao && <span className="text-muted-foreground"> · {item.descricao}</span>}
                </td>
                <td className={td}>{item.tipoServico || "-"}</td>
                <td className={`${td} text-right tabular-nums`}>{formatNumber(item.pendente, 4)}</td>
                <td className={`${td} whitespace-nowrap text-right tabular-nums`}>{formatCurrency(item.valorTotal)}</td>
                <td className={td}>{item.etapaAtual || "-"}</td>
              </tr>
              {item.materiaisPendentes.length > 0 && (
                <tr>
                  <td />
                  <td colSpan={9} className="border-b border-border px-1.5 pb-1.5 pt-0">
                    <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-warning">
                      Materiais pendentes
                    </p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      {item.materiaisPendentes.map((m, i) => (
                        <li key={`${m.codigo}-${i}`} className="flex gap-1.5">
                          <span className="font-medium">{m.codigo}</span>
                          <span className="min-w-0 flex-1 truncate text-muted-foreground">{m.descricao}</span>
                          <span className="whitespace-nowrap tabular-nums">
                            {formatNumber(m.quantidadePendente, 4)} {m.unidadeMedida}
                          </span>
                          <span
                            className={`w-16 whitespace-nowrap text-right tabular-nums ${materialEmRisco(m, item) ? "font-semibold text-danger" : "text-muted-foreground"}`}
                          >
                            {m.previsao ? formatDateBR(m.previsao) : "sem prev."}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </section>
    </PrintReport>
  );
}
