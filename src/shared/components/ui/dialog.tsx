import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl";
  /**
   * Limita a altura do diálogo à viewport e transforma o corpo em coluna flex (min-h-0).
   * O conteúdo decide o que rola — ex.: área central com overflow-y-auto e rodapé fixo.
   */
  scrollable?: boolean;
}

/**
 * Diálogos abertos, do mais antigo ao mais novo. Com um modal por cima de outro (cadastro rápido),
 * só o do topo reage ao Esc, e a rolagem da página só volta quando o último fecha.
 */
const pilha: symbol[] = [];

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "lg",
  scrollable = false,
}: DialogProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Ref: o onClose costuma ser uma função nova a cada render, e reinscrever o diálogo o tiraria do topo
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!open) return;
    const id = Symbol("dialog");
    pilha.push(id);
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pilha[pilha.length - 1] === id) {
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      pilha.splice(pilha.indexOf(id), 1);
      if (pilha.length === 0) document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
  };

  // Portal no <body>: um diálogo aberto de dentro de um formulário não fica com um <form> dentro do outro.
  // O submit ainda sobe pela árvore do React até o formulário de fora, por isso é barrado aqui.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onSubmit={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative w-full rounded-2xl bg-card border border-border p-6 shadow-2xl transition-all z-10",
          scrollable && "flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-3rem)]",
          maxWidths[maxWidth],
          className
        )}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {(title || description) && (
          <div className={cn("mb-5 pr-8", scrollable && "shrink-0")}>
            {title && (
              <h2 id={titleId} className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn(scrollable && "flex min-h-0 flex-1 flex-col")}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

