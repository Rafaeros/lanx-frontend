import * as React from "react";
import { FileText, Loader2 } from "lucide-react";
import { MediaViewer, podeVisualizar } from "@/shared/components/ui/media-viewer";
import { useToast } from "@/shared/components/ui/toast";
import { useObjectUrl } from "@/shared/hooks/use-object-url";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { saveBlob } from "@/shared/lib/download";
import { formatBytes } from "@/shared/lib/utils";
import { useAnexoBlobQuery, useBaixarAnexoMutation } from "../hooks/use-nao-conformidades";
import type { NaoConformidadeAnexo } from "../types";

export interface AnexosGaleriaProps {
  naoConformidadeId: string;
  anexos: NaoConformidadeAnexo[];
}

const isImagem = (anexo: NaoConformidadeAnexo) => anexo.contentType.startsWith("image/");

/** Anexos em miniaturas: clique abre o visualizador (imagem ou PDF) sem baixar o arquivo. */
export function AnexosGaleria({ naoConformidadeId, anexos }: AnexosGaleriaProps) {
  const [aberto, setAberto] = React.useState<number | null>(null);

  if (anexos.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum anexo.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {anexos.map((anexo, index) => (
          <li key={anexo.id}>
            <Miniatura naoConformidadeId={naoConformidadeId} anexo={anexo} onOpen={() => setAberto(index)} />
          </li>
        ))}
      </ul>

      {aberto !== null && (
        <Visualizador
          naoConformidadeId={naoConformidadeId}
          anexos={anexos}
          index={aberto}
          onIndexChange={setAberto}
          onClose={() => setAberto(null)}
        />
      )}
    </>
  );
}

/** Foto: a própria imagem (o blob baixado já serve ao visualizador). PDF e outros: ícone, sem baixar. */
function Miniatura({
  naoConformidadeId,
  anexo,
  onOpen,
}: {
  naoConformidadeId: string;
  anexo: NaoConformidadeAnexo;
  onOpen: () => void;
}) {
  const imagem = isImagem(anexo);
  const { data: blob, isLoading, isError } = useAnexoBlobQuery(naoConformidadeId, anexo, imagem);
  const url = useObjectUrl(blob);
  const visualizavel = podeVisualizar(anexo.contentType);

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!visualizavel}
      title={visualizavel ? `Visualizar ${anexo.nomeArquivo}` : anexo.nomeArquivo}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
    >
      <span className="flex aspect-[4/3] w-full items-center justify-center bg-muted/60">
        {imagem && url ? (
          <img src={url} alt={anexo.nomeArquivo} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : imagem && isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <span className="text-[10px] font-semibold uppercase">
              {isError ? "Falha ao carregar" : anexo.contentType === "application/pdf" ? "PDF" : "Arquivo"}
            </span>
          </span>
        )}
      </span>
      <span className="flex items-center justify-between gap-2 px-2.5 py-1.5">
        <span className="min-w-0 truncate text-xs font-medium text-foreground">{anexo.nomeArquivo}</span>
        <span className="shrink-0 text-[10px] text-muted-foreground">{formatBytes(anexo.tamanhoBytes)}</span>
      </span>
    </button>
  );
}

function Visualizador({
  naoConformidadeId,
  anexos,
  index,
  onIndexChange,
  onClose,
}: {
  naoConformidadeId: string;
  anexos: NaoConformidadeAnexo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const anexo = anexos[index];
  const { data: blob, isLoading, isError, error } = useAnexoBlobQuery(naoConformidadeId, anexo);
  const url = useObjectUrl(blob);
  const baixar = useBaixarAnexoMutation();

  const total = anexos.length;
  const onPrev = React.useCallback(() => onIndexChange((index - 1 + total) % total), [index, total, onIndexChange]);
  const onNext = React.useCallback(() => onIndexChange((index + 1) % total), [index, total, onIndexChange]);

  const onDownload = () => {
    // já está em memória: salva sem baixar de novo
    if (blob) {
      saveBlob(blob, anexo.nomeArquivo);
      return;
    }
    baixar.mutate(
      { naoConformidadeId, anexo },
      { onError: (err) => toast.error("Não foi possível baixar o anexo", getApiErrorMessage(err, "Tente novamente.")) }
    );
  };

  return (
    <MediaViewer
      open
      onClose={onClose}
      nome={anexo.nomeArquivo}
      contentType={anexo.contentType}
      url={url}
      isLoading={isLoading}
      error={isError ? getApiErrorMessage(error, "Não foi possível carregar o anexo.") : null}
      index={index}
      total={total}
      onPrev={onPrev}
      onNext={onNext}
      onDownload={onDownload}
    />
  );
}

