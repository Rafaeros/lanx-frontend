import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

/** Falha na consulta sem dados anteriores para mostrar (ex.: cg-scraper fora do ar). */
export function CarteiraErro({ mensagem, onTentarNovamente }: { mensagem: string; onTentarNovamente: () => void }) {
  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-6 py-10 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-danger" />
      <div>
        <p className="font-semibold text-foreground">Não foi possível consultar a carteira</p>
        <p className="mt-1 text-sm text-muted-foreground">{mensagem}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onTentarNovamente}>
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </section>
  );
}
