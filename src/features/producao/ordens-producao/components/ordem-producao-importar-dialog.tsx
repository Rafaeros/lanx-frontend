import * as React from "react";
import { AlertTriangle, CircleCheck, FilePlus2, FileSpreadsheet, RefreshCcw } from "lucide-react";
import { Dialog } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FileDropzone } from "@/shared/components/ui/file-dropzone";
import { StatCard } from "@/shared/components/ui/stat-card";
import { useToast } from "@/shared/components/ui/toast";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useImportarOrdensProducaoMutation } from "../hooks/use-ordens-producao";
import type { ImportarOrdensResponse } from "../types";

export interface OrdemProducaoImportarDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Colunas que a importação lê da exportação de OPs do ERP. */
const COLUNAS = ["Código", "Cliente", "Cód. Material", "Material", "Quantidade", "Entrega", "Status"];

/**
 * Importação da planilha de OPs do ERP em dois passos: escolher o arquivo (e se entram as
 * finalizadas) e ver o resultado, com as linhas que não entraram e o motivo.
 */
export function OrdemProducaoImportarDialog({ open, onClose }: OrdemProducaoImportarDialogProps) {
  const toast = useToast();
  const importar = useImportarOrdensProducaoMutation();
  const [arquivo, setArquivo] = React.useState<File | null>(null);
  const [incluirFinalizadas, setIncluirFinalizadas] = React.useState(false);
  const [resultado, setResultado] = React.useState<ImportarOrdensResponse | null>(null);

  const fechar = () => {
    if (importar.isPending) return;
    setArquivo(null);
    setIncluirFinalizadas(false);
    setResultado(null);
    importar.reset();
    onClose();
  };

  const enviar = () => {
    if (!arquivo) return;
    importar.mutate(
      { arquivo, incluirFinalizadas },
      {
        onSuccess: (r) => {
          setResultado(r);
          toast.success("Planilha importada", `${r.criadas} criadas · ${r.atualizadas} atualizadas`);
        },
        onError: (err) => toast.error("Não foi possível importar", getApiErrorMessage(err, "Tente novamente.")),
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={fechar}
      title="Importar ordens de produção"
      description={
        resultado
          ? `${resultado.linhasLidas} linhas lidas da planilha.`
          : "Planilha de OPs exportada do ERP (.xlsx). OPs que já existem são atualizadas pelo código; a etapa atual não muda."
      }
      maxWidth="2xl"
    >
      {resultado ? (
        <ResultadoImportacao resultado={resultado} onConcluir={fechar} />
      ) : (
        <div className="space-y-4">
          <FileDropzone
            file={arquivo}
            onChange={setArquivo}
            accept={[".xlsx"]}
            maxSizeMb={20}
            title="Arraste a planilha de OPs aqui ou clique para escolher"
            hint={`Colunas lidas pelo nome: ${COLUNAS.join(", ")}`}
            disabled={importar.isPending}
          />

          <Checkbox
            checked={incluirFinalizadas}
            onChange={setIncluirFinalizadas}
            disabled={importar.isPending}
            label="Incluir OPs finalizadas"
            description="Sem marcar, entram só as liberadas e iniciadas. Marque para trazer o histórico (ex.: lançar não conformidade em OP antiga)."
          />

          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            Cliente e produto que ainda não estão cadastrados são criados na hora: o cliente pelo nome e o produto
            como produto acabado, na unidade UN.
          </p>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={fechar} disabled={importar.isPending}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={enviar} disabled={!arquivo} isLoading={importar.isPending}>
              {!importar.isPending && <FileSpreadsheet className="h-4 w-4" />}
              {importar.isPending ? "Importando..." : "Importar planilha"}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function ResultadoImportacao({ resultado: r, onConcluir }: { resultado: ImportarOrdensResponse; onConcluir: () => void }) {
  const cadastros = [
    r.clientesCriados > 0 && `${r.clientesCriados} ${r.clientesCriados === 1 ? "cliente" : "clientes"}`,
    r.materiaisCriados > 0 && `${r.materiaisCriados} ${r.materiaisCriados === 1 ? "produto" : "produtos"}`,
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCard label="OPs criadas" value={String(r.criadas)} icon={FilePlus2} tone="bg-success/10 text-success" />
        <StatCard label="OPs atualizadas" value={String(r.atualizadas)} icon={RefreshCcw} tone="bg-primary/10 text-primary" />
        <StatCard
          label="Finalizadas ignoradas"
          value={String(r.finalizadasIgnoradas)}
          detail={r.finalizadasIgnoradas > 0 ? "Importe de novo marcando “Incluir OPs finalizadas”." : undefined}
          icon={CircleCheck}
          tone="bg-muted text-muted-foreground"
        />
        <StatCard
          label="Linhas rejeitadas"
          value={String(r.rejeitadas.length)}
          valueClassName={r.rejeitadas.length > 0 ? "text-danger" : undefined}
          icon={AlertTriangle}
          tone="bg-danger/10 text-danger"
        />
      </div>

      {cadastros.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Cadastrados na importação: <span className="font-medium text-foreground">{cadastros.join(" e ")}</span>.
        </p>
      )}

      {r.rejeitadas.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">Linhas que não entraram</h3>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Linha</th>
                  <th className="px-3 py-2 text-left font-medium">Código</th>
                  <th className="px-3 py-2 text-left font-medium">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {r.rejeitadas.map((l) => (
                  <tr key={l.linha}>
                    <td className="px-3 py-1.5 tabular-nums text-foreground">{l.linha}</td>
                    <td className="max-w-40 truncate px-3 py-1.5 font-mono text-foreground" title={l.codigo ?? ""}>
                      {l.codigo || "-"}
                    </td>
                    <td className="px-3 py-1.5 text-danger">{l.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-border pt-3">
        <Button type="button" variant="primary" onClick={onConcluir}>
          Concluir
        </Button>
      </div>
    </div>
  );
}
