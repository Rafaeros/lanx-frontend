import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";

export interface ImportarPedidosDialogProps {
  open: boolean;
  periodoInicial: { dataInicio: string; dataFim: string };
  isLoading?: boolean;
  onClose: () => void;
  onImport: (periodo: { dataInicio: string; dataFim: string }) => void;
}

/** Período próprio, iniciado com o filtro da tela: importar não muda o que está sendo consultado. */
export function ImportarPedidosDialog({ open, periodoInicial, isLoading, onClose, onImport }: ImportarPedidosDialogProps) {
  const [periodo, setPeriodo] = React.useState(periodoInicial);

  React.useEffect(() => {
    // reinicia com o período da tela a cada abertura
    if (open) setPeriodo(periodoInicial);
  }, [open]);

  const invalido = !periodo.dataInicio || !periodo.dataFim || periodo.dataInicio > periodo.dataFim;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Importar pedidos do ERP"
      description="Busca no ERP os pedidos emitidos no período e substitui os itens desse período na base. Nada é duplicado."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="block text-xs font-medium text-foreground">Data inicial</span>
            <Input
              type="date"
              value={periodo.dataInicio}
              onChange={(e) => setPeriodo((p) => ({ ...p, dataInicio: e.target.value }))}
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-foreground">Data final</span>
            <Input
              type="date"
              value={periodo.dataFim}
              onChange={(e) => setPeriodo((p) => ({ ...p, dataFim: e.target.value }))}
            />
          </label>
        </div>
        {invalido && periodo.dataInicio && periodo.dataFim && (
          <p className="text-xs font-medium text-danger">A data inicial precisa ser anterior ou igual à final.</p>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => onImport(periodo)} isLoading={isLoading} disabled={invalido}>
            Importar pedidos
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
