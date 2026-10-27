import { AlertTriangle } from "lucide-react";
import type { CarteiraItemResponse } from "../types";
import { Dialog } from "@/shared/components/ui/dialog";
import { formatDateBR, formatNumber } from "@/shared/lib/utils";
import { materialEmRisco, materiaisTexto } from "../lib/carteira";

/** Materiais que faltam para a OP do pedido (requisições pendentes no ERP). */
export function MateriaisPendentesDialog({ item, onClose }: { item: CarteiraItemResponse | null; onClose: () => void }) {
  if (!item) return null;
  const emRisco = item.materiaisPendentes.filter((m) => materialEmRisco(m, item)).length;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="4xl"
      scrollable
      title={`Materiais pendentes · ${item.ordem ?? "sem OP"}`}
      description={`${item.codigo ?? ""} ${item.descricao ?? ""} · ${item.cliente ?? ""} · entrega prevista ${formatDateBR(item.previsao)}`}
    >
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        {emRisco > 0 && (
          <p className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            {materiaisTexto(emRisco)} com previsão vencida ou para depois da entrega do pedido (em vermelho).
          </p>
        )}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Material</th>
                <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                <th className="px-3 py-2 text-right font-semibold">Pendente</th>
                <th className="px-3 py-2 text-left font-semibold">Previsão</th>
              </tr>
            </thead>
            <tbody>
              {item.materiaisPendentes.map((m, index) => {
                const risco = materialEmRisco(m, item);
                return (
                  <tr key={`${m.codigo}-${index}`} className="border-t border-border">
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-foreground">{m.codigo || "-"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{m.descricao || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                      {formatNumber(m.quantidadePendente, 4)} {m.unidadeMedida}
                    </td>
                    <td className={`whitespace-nowrap px-3 py-2 tabular-nums ${risco ? "font-semibold text-danger" : ""}`}>
                      {m.previsao ? formatDateBR(m.previsao) : <span className="text-muted-foreground">Sem previsão</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  );
}
