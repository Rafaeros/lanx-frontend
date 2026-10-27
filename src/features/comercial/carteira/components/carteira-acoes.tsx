import { FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface CarteiraAcoesProps {
  consultando: boolean;
  podeAtualizar: boolean;
  podeExportar: boolean;
  exportandoPlanilha: boolean;
  imprimindo: boolean;
  onAtualizar: () => void;
  onPlanilha: () => void;
  onPdf: () => void;
}

/** Ações do cabeçalho: nova leitura do ERP e exportação (Excel / PDF). */
export function CarteiraAcoes({
  consultando,
  podeAtualizar,
  podeExportar,
  exportandoPlanilha,
  imprimindo,
  onAtualizar,
  onPlanilha,
  onPdf,
}: CarteiraAcoesProps) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onAtualizar}
        disabled={consultando || !podeAtualizar}
        className="h-9"
        title="Consultar o ERP de novo, ignorando a consulta guardada"
      >
        <RefreshCw className={`h-4 w-4 ${consultando ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Atualizar</span>
      </Button>
      <PermissionGate permission="comercial.carteira:exportar">
        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            onClick={onPlanilha}
            isLoading={exportandoPlanilha}
            disabled={!podeExportar}
            className="h-9 rounded-r-none"
            title="Baixar planilha Excel com a carteira e os materiais pendentes"
          >
            {!exportandoPlanilha && <FileSpreadsheet className="h-4 w-4 text-success" />}
            Planilha
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPdf}
            disabled={!podeExportar || imprimindo}
            className="-ml-px h-9 rounded-l-none"
            title="Gerar relatório em PDF (use “Salvar como PDF” na janela de impressão)"
          >
            <FileText className="h-4 w-4 text-danger" />
            PDF
          </Button>
        </div>
      </PermissionGate>
    </>
  );
}
