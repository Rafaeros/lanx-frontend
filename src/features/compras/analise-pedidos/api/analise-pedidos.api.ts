import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type {
  AnalisePedidoResponse,
  AnalisePedidosFiltro,
  ImportarAnalisePedidoResponse,
  ResumoAnalisePedidosResponse,
} from "../types";
import { env } from "@/config/env";
import { rethrowBlobError, saveBlobResponse } from "@/shared/lib/download";
import { paginate } from "@/shared/lib/pagination";
import { situacaoDe } from "../lib/situacao";
import type { RateioFiltro } from "../../shared/rateios";

const MOCK_PEDIDOS: AnalisePedidoResponse[] = [
  {
    id: "mock-item-1",
    requisicaoDeCompra: "RC-2026-0081",
    solicitante: "Carlos Engenharia",
    dataEmissaoRc: "2026-10-01",
    dataPrevisaoEntregaRc: "2026-10-20",
    pedidoDeCompra: "PC-99120",
    comprador: { id: "mock-comprador-1", nome: "Mariana Silva" },
    dataEmissaoPc: "2026-10-03",
    dataPrevisaoEntregaPc: "2026-10-22",
    dataEntregaPc: "2026-10-18",
    fornecedor: { id: "mock-fornecedor-1", nome: "Aço Tubos Tubulares SA", pais: "Brasil" },
    material: { id: "mock-material-1", codigo: "MAT-1003", descricao: "Tubo Industrial Schedule 40 3 Metros" },
    unidadeMedida: { id: "mock-unidade-m", sigla: "M" },
    quantidadeSolicitada: 150,
    quantidadeAtendida: 150,
    saldo: 0,
    leadTimeDias: 15,
    atendimentoParcial: false,
    local: "Almoxarifado Central",
    valorUnitario: 85.5,
    valorFrete: 250,
    ipi: 400,
    valorTotal: 13475.0,
    condicaoPagamento: "30/60 Dias",
    ncm: "7306.30.00",
    recebimento: "REC-4412",
    notaFiscal: "NF-89211",
    quantidadeRecebimentos: 1,
    rateio: { id: "mock-rateio-2", nome: "Manutenção Industrial" },
    referencia: "Obra 04",
    invoice: "INV-998",
    responsavelCompras: "Mariana Silva",
    observacao: "Entregue conforme especificação técnica sem desvios",
  },
  {
    id: "mock-item-2",
    requisicaoDeCompra: "RC-2026-0094",
    solicitante: "Juliana Operações",
    dataEmissaoRc: "2026-10-05",
    dataPrevisaoEntregaRc: "2026-10-25",
    pedidoDeCompra: "PC-99145",
    comprador: { id: "mock-comprador-3", nome: "Mariana Silva" },
    dataEmissaoPc: "2026-10-06",
    dataPrevisaoEntregaPc: "2026-10-24",
    fornecedor: { id: "mock-fornecedor-2", nome: "Valvtech Componentes Ltda", pais: "Brasil" },
    material: { id: "mock-material-2", codigo: "MAT-1001", descricao: "Válvula Esférica Inox 316 2 Polegadas" },
    unidadeMedida: { id: "mock-unidade-un", sigla: "UN" },
    quantidadeSolicitada: 40,
    quantidadeAtendida: 25,
    saldo: 15,
    leadTimeDias: 18,
    atendimentoParcial: true,
    local: "Fábrica Unidade 2",
    valorUnitario: 320.0,
    valorFrete: 180,
    ipi: 800,
    valorTotal: 13780.0,
    condicaoPagamento: "28 Dias",
    ncm: "8481.80.95",
    recebimento: "REC-4430",
    notaFiscal: "NF-12004",
    quantidadeRecebimentos: 1,
    rateio: { id: "mock-rateio-4", nome: "Operação Contínua" },
    referencia: "Linha de Produção B",
    invoice: "INV-1004",
    responsavelCompras: "Mariana Silva",
    observacao: "Entrega restante do saldo prevista para próxima semana",
  },
  {
    id: "mock-item-3",
    requisicaoDeCompra: "RC-2026-0102",
    solicitante: "Roberto Almoxarifado",
    dataEmissaoRc: "2026-10-08",
    dataPrevisaoEntregaRc: "2026-10-30",
    pedidoDeCompra: "PC-99180",
    comprador: { id: "mock-comprador-5", nome: "Mariana Silva" },
    dataEmissaoPc: "2026-10-10",
    dataPrevisaoEntregaPc: "2026-10-28",
    fornecedor: { id: "mock-fornecedor-3", nome: "Metalúrgica Gerdau do Brasil", pais: "Brasil" },
    material: { id: "mock-material-3", codigo: "MAT-1002", descricao: "Chapa de Aço Carbono 1/4x1200x3000mm" },
    unidadeMedida: { id: "mock-unidade-kg", sigla: "KG" },
    quantidadeSolicitada: 1200,
    quantidadeAtendida: 1200,
    saldo: 0,
    leadTimeDias: 18,
    atendimentoParcial: false,
    local: "Almoxarifado Central",
    valorUnitario: 9.8,
    valorFrete: 650,
    ipi: 580,
    valorTotal: 12990.0,
    condicaoPagamento: "45 Dias",
    ncm: "7208.51.00",
    recebimento: "REC-4465",
    notaFiscal: "NF-90812",
    quantidadeRecebimentos: 1,
    rateio: { id: "mock-rateio-6", nome: "Caldeiraria Pesada" },
    referencia: "Tanque T-101",
    invoice: "INV-1025",
    responsavelCompras: "Mariana Silva",
    observacao: "Material inspecionado com laudo de qualidade anexo",
  },
];

function filtrarMock(filtro: AnalisePedidosFiltro): AnalisePedidoResponse[] {
  const busca = (filtro.busca ?? "").trim().toLowerCase();
  return MOCK_PEDIDOS.filter((p) => {
    const emissao = p.dataEmissaoPc ?? "";
    if (emissao < filtro.dataInicio || emissao > filtro.dataFim) return false;
    if (filtro.situacao && situacaoDe(p) !== filtro.situacao) return false;
    if (filtro.rateios?.length && !filtro.rateios.includes(p.rateio?.id ?? "")) return false;
    if (!busca) return true;
    return [p.pedidoDeCompra, p.requisicaoDeCompra, p.fornecedor?.nome, p.material?.codigo, p.material?.descricao].some((v) =>
      (v ?? "").toLowerCase().includes(busca)
    );
  });
}

/**
 * Remove filtros vazios para não mandar `busca=&situacao=` na URL. Rateios vão como
 * rateios=id1&rateios=id2 (sem colchetes), que é o que o Spring entende como lista.
 */
function params(filtro: AnalisePedidosFiltro, extra: Record<string, string | number> = {}) {
  const search = new URLSearchParams({ dataInicio: filtro.dataInicio, dataFim: filtro.dataFim });
  if (filtro.busca?.trim()) search.set("busca", filtro.busca.trim());
  if (filtro.situacao) search.set("situacao", filtro.situacao);
  filtro.rateios?.forEach((r) => search.append("rateios", r));
  Object.entries(extra).forEach(([k, v]) => search.set(k, String(v)));
  return search;
}

const MOCK_RATEIOS: RateioFiltro[] = MOCK_PEDIDOS.flatMap((p) => (p.rateio ? [p.rateio] : [])).sort((a, b) =>
  a.nome.localeCompare(b.nome)
);

export const analisePedidosApi = {
  /** GET /compras/relatorios/analise-pedidos: itens paginados, ordenados por emissão do PC. */
  consultar: async (
    filtro: AnalisePedidosFiltro,
    page = 0,
    size = 20
  ): Promise<PageResult<AnalisePedidoResponse>> => {
    try {
      const response = await apiClient.get<ApiResponse<PageResult<AnalisePedidoResponse>>>(
        "/compras/relatorios/analise-pedidos",
        { params: params(filtro, { page, size }) }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return paginate(filtrarMock(filtro), page, size);
      throw error;
    }
  },

  /** GET /compras/relatorios/analise-pedidos/resumo: totais de tudo que atende aos filtros. */
  resumo: async (filtro: AnalisePedidosFiltro): Promise<ResumoAnalisePedidosResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<ResumoAnalisePedidosResponse>>(
        "/compras/relatorios/analise-pedidos/resumo",
        { params: params(filtro) }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const itens = filtrarMock(filtro);
        const leadTimes = itens.map((i) => i.leadTimeDias).filter((v): v is number => v != null);
        return {
          totalItens: itens.length,
          valorTotal: itens.reduce((acc, i) => acc + (i.valorTotal ?? 0), 0),
          pendentes: itens.filter((i) => situacaoDe(i) === "PENDENTE").length,
          parciais: itens.filter((i) => situacaoDe(i) === "PARCIAL").length,
          atendidos: itens.filter((i) => situacaoDe(i) === "ATENDIDO").length,
          leadTimeMedioDias: leadTimes.length
            ? Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length)
            : null,
        };
      }
      throw error;
    }
  },

  /** GET .../exportar: planilha (.xlsx) com todos os itens dos filtros, sem paginação. */
  exportar: async (filtro: AnalisePedidosFiltro): Promise<void> => {
    const response = await apiClient
      .get<Blob>("/compras/relatorios/analise-pedidos/exportar", {
        params: params(filtro),
        responseType: "blob",
        timeout: 120000,
      })
      .catch(rethrowBlobError);
    saveBlobResponse(response, `analise-pedidos_${filtro.dataInicio}_${filtro.dataFim}.xlsx`);
  },

  /** GET .../rateios: rateios (id e nome) presentes nos itens importados, para o filtro. */
  rateios: async (): Promise<RateioFiltro[]> => {
    try {
      const response = await apiClient.get<ApiResponse<RateioFiltro[]>>("/compras/relatorios/analise-pedidos/rateios");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return MOCK_RATEIOS;
      throw error;
    }
  },

  /** POST .../importar: substitui os itens do período pelos do ERP. */
  importar: async (dataInicio: string, dataFim: string): Promise<ImportarAnalisePedidoResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<ImportarAnalisePedidoResponse>>(
        "/compras/relatorios/analise-pedidos/importar",
        null,
        // o backend busca o ERP mês a mês (~20 s por mês): um semestre passa de 1,5 min
        { params: { dataInicio, dataFim }, timeout: 15 * 60 * 1000 }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return { itensImportados: MOCK_PEDIDOS.length };
      throw error;
    }
  },
};
