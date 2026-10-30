import * as React from "react";
import { FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { cn, formatBytes } from "@/shared/lib/utils";
import {
  ANEXO_MAX_MB,
  ANEXOS_EXTENSOES,
  ANEXOS_MAX_ARQUIVOS,
  ANEXOS_MAX_TOTAL_MB,
} from "../lib/anexos";

export interface AnexosInputProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

/** Vários arquivos (fotos e laudos): clique ou arraste. Valida formato, quantidade e tamanho antes de aceitar. */
export function AnexosInput({ files, onChange, disabled }: AnexosInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const adicionar = (lista: FileList | null | undefined) => {
    if (!lista?.length) return;
    const novos = Array.from(lista);
    const invalido = novos.find((f) => !ANEXOS_EXTENSOES.some((ext) => f.name.toLowerCase().endsWith(ext)));
    if (invalido) {
      setErro(`"${invalido.name}": formato não aceito. Use PDF, JPG, PNG ou WEBP.`);
      return;
    }
    const grande = novos.find((f) => f.size > ANEXO_MAX_MB * 1024 * 1024);
    if (grande) {
      setErro(`"${grande.name}" é maior que ${ANEXO_MAX_MB} MB.`);
      return;
    }
    const todos = [...files, ...novos];
    if (todos.length > ANEXOS_MAX_ARQUIVOS) {
      setErro(`No máximo ${ANEXOS_MAX_ARQUIVOS} anexos.`);
      return;
    }
    if (todos.reduce((soma, f) => soma + f.size, 0) > ANEXOS_MAX_TOTAL_MB * 1024 * 1024) {
      setErro(`Os anexos somados passam de ${ANEXOS_MAX_TOTAL_MB} MB.`);
      return;
    }
    setErro(null);
    onChange(todos);
  };

  const remover = (index: number) => {
    setErro(null);
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          adicionar(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
          arrastando ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
          erro && "border-danger/50"
        )}
      >
        <Paperclip className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Anexar fotos ou laudos</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          PDF, JPG, PNG ou WEBP · até {ANEXOS_MAX_ARQUIVOS} arquivos
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ANEXOS_EXTENSOES.join(",")}
        className="hidden"
        onChange={(e) => {
          adicionar(e.target.files);
          e.target.value = "";
        }}
      />
      {erro && <p className="text-xs font-medium text-danger">{erro}</p>}

      {files.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-3 py-2">
              {file.type.startsWith("image/") ? (
                <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm text-foreground" title={file.name}>
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              <button
                type="button"
                onClick={() => remover(index)}
                disabled={disabled}
                aria-label={`Remover ${file.name}`}
                className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
