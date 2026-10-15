import apiClient from "@/shared/api/client";
import type {
  ApiResponse,
  AnalisePedidoResponse,
  ImportarAnalisePedidoRequest,
  ImportarAnalisePedidoResponse,
} from "@/shared/api/schema";
import { env } from "@/config/env";

const MOCK_PEDIDOS: AnalisePedidoResponse[] = [
  {
    requisicaoDeCompra: "RC-2026-0081",
    solicitante: "Carlos Engenharia",
    dataEmissaoRc: "2026-10-01",
    dataPrevisaoEntregaRc: "2026-10-20",
    pedidoDeCompra: "PC-99120",
    comprador: "Mariana Silva",
    dataEmissaoPc: "2026-10-03",
    dataPrevisaoEntregaPc: "2026-10-22",
    dataEntregaPc: "2026-10-18",
    fornecedor: "Aço Tubos Tubulares SA",
    pais: "Brasil",
    codigoItem: "MAT-1003",
    descricaoItem: "Tubo Industrial Schedule 40 3 Metros",
    unidadeMedida: "M",
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
    rateio: "Manutenção Industrial",
    referencia: "Obra 04",
    invoice: "INV-998",
    responsavelCompras: "Mariana Silva",
    observacao: "Entregue conforme especificação técnica sem desvios",
  },
  {
    requisicaoDeCompra: "RC-2026-0094",
    solicitante: "Juliana Operações",
    dataEmissaoRc: "2026-10-05",
    dataPrevisaoEntregaRc: "2026-10-25",
    pedidoDeCompra: "PC-99145",
    comprador: "Mariana Silva",
    dataEmissaoPc: "2026-10-06",
    dataPrevisaoEntregaPc: "2026-10-24",
    fornecedor: "Valvtech Componentes Ltda",
    pais: "Brasil",
    codigoItem: "MAT-1001",
    descricaoItem: "Válvula Esférica Inox 316 2 Polegadas",
    unidadeMedida: "UN",
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
    rateio: "Operação Contínua",
    referencia: "Linha de Produção B",
    invoice: "INV-1004",
    responsavelCompras: "Mariana Silva",
    observacao: "Entrega restante do saldo prevista para próxima semana",
  },
  {
    requisicaoDeCompra: "RC-2026-0102",
    solicitante: "Roberto Almoxarifado",
    dataEmissaoRc: "2026-10-08",
    dataPrevisaoEntregaRc: "2026-10-30",
    pedidoDeCompra: "PC-99180",
    comprador: "Mariana Silva",
    dataEmissaoPc: "2026-10-10",
    dataPrevisaoEntregaPc: "2026-10-28",
    fornecedor: "Metalúrgica Gerdau do Brasil",
    pais: "Brasil",
    codigoItem: "MAT-1002",
    descricaoItem: "Chapa de Aço Carbono 1/4x1200x3000mm",
    unidadeMedida: "KG",
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
    rateio: "Caldeiraria Pesada",
    referencia: "Tanque T-101",
    invoice: "INV-1025",
    responsavelCompras: "Mariana Silva",
    observacao: "Material inspecionado com laudo de qualidade anexo",
  },
];

export const analisePedidosApi = {
  consultar: async (
    filtro: ImportarAnalisePedidoRequest = {}
  ): Promise<AnalisePedidoResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AnalisePedidoResponse[]>>(
        "/compras/relatorios/analise-pedidos",
        { params: filtro }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        return MOCK_PEDIDOS;
      }
      throw error;
    }
  },

  importar: async (
    dataInicio: string,
    dataFim: string
  ): Promise<ImportarAnalisePedidoResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<ImportarAnalisePedidoResponse>>(
        "/compras/relatorios/analise-pedidos/importar",
        null,
        { params: { dataInicio, dataFim } }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        return { itensImportados: 14 };
      }
      throw error;
    }
  },
};

