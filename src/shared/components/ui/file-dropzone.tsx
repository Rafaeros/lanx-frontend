import * as React from "react";
import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface FileDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  /** Extensões aceitas, ex.: [".xlsx", ".xls"]. */
  accept: string[];
  /** Tamanho máximo em MB. */
  maxSizeMb?: number;
  title?: string;
  hint?: string;
  disabled?: boolean;
  error?: string;
}

const formatarTamanho = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Área de upload de um arquivo: clique ou arraste. Valida extensão e tamanho antes de aceitar. */
export function FileDropzone({
  file,
  onChange,
  accept,
  maxSizeMb = 10,
  title = "Arraste o arquivo aqui ou clique para escolher",
  hint,
  disabled,
  error,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = React.useState(false);
  const [erroLocal, setErroLocal] = React.useState<string | null>(null);

  const aceitar = (candidato: File | undefined) => {
    if (!candidato) return;
    const nome = candidato.name.toLowerCase();
    if (!accept.some((ext) => nome.endsWith(ext))) {
      setErroLocal(`Formato não aceito. Use ${accept.join(" ou ")}.`);
      return;
    }
    if (candidato.size > maxSizeMb * 1024 * 1024) {
      setErroLocal(`Arquivo maior que ${maxSizeMb} MB.`);
      return;
    }
    setErroLocal(null);
    onChange(candidato);
  };

  const mensagem = erroLocal ?? error;

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">{formatarTamanho(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={disabled}
          aria-label="Remover arquivo"
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
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
          aceitar(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
          arrastando ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
          mensagem && "border-danger/50"
        )}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="hidden"
        onChange={(e) => {
          aceitar(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {mensagem && <p className="text-xs font-medium text-danger">{mensagem}</p>}
    </div>
  );
}
