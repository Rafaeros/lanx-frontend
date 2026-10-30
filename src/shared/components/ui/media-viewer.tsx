import * as React from "react";
import { ChevronLeft, ChevronRight, Download, FileQuestion, Loader2 } from "lucide-react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { cn } from "@/shared/lib/utils";

/** Tipos que o navegador mostra sozinho: imagem em <img>, PDF no leitor embutido (<iframe>). */
export function podeVisualizar(contentType: string): boolean {
  return contentType.startsWith("image/") || contentType === "application/pdf";
}

export interface MediaViewerProps {
  open: boolean;
  onClose: () => void;
  /** Nome do arquivo, no título. */
  nome: string;
  contentType: string;
  /** URL blob: (ver useObjectUrl) ou pública; null enquanto carrega. */
  url: string | null;
  isLoading?: boolean;
  error?: string | null;
  /** Posição na galeria: com mais de um item aparecem as setas (e ← → no teclado). */
  index?: number;
  total?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onDownload?: () => void;
}

/**
 * Visualizador de imagem/PDF dentro do app, num modal grande: navegação entre os itens, baixar e
 * fechar com Esc. Não sabe de onde vem o arquivo: quem usa entrega a URL já pronta.
 */
export function MediaViewer({
  open,
  onClose,
  nome,
  contentType,
  url,
  isLoading,
  error,
  index = 0,
  total = 1,
  onPrev,
  onNext,
  onDownload,
}: MediaViewerProps) {
  const galeria = total > 1;

  React.useEffect(() => {
    if (!open || !galeria) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, galeria, onPrev, onNext]);

  const pdf = contentType === "application/pdf";

  return (
    <Dialog open={open} onClose={onClose} title={nome} maxWidth="6xl" scrollable>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden rounded-xl bg-muted/50">
          {isLoading || (!url && !error) ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : error ? (
            <p className="px-6 text-center text-sm text-danger">{error}</p>
          ) : !podeVisualizar(contentType) ? (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <FileQuestion className="h-8 w-8" />
              Este tipo de arquivo não tem pré-visualização. Use “Baixar”.
            </div>
          ) : pdf ? (
            <iframe src={url!} title={nome} className="h-[75vh] w-full border-0 bg-white" />
          ) : (
            <img src={url!} alt={nome} className="max-h-[75vh] w-auto max-w-full object-contain" />
          )}

          {galeria && (
            <>
              <NavButton lado="esquerda" onClick={onPrev} />
              <NavButton lado="direita" onClick={onNext} />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {galeria ? `${index + 1} de ${total} · use ← → para navegar` : "Esc para fechar"}
          </span>
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload} disabled={!url} className="h-9">
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

function NavButton({ lado, onClick }: { lado: "esquerda" | "direita"; onClick?: () => void }) {
  const Icon = lado === "esquerda" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === "esquerda" ? "Anterior" : "Próximo"}
      className={cn(
        "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card/90 text-foreground shadow-md transition-colors hover:bg-card",
        lado === "esquerda" ? "left-3" : "right-3"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
