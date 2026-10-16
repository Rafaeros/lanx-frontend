import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "./dialog";
import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

/** Confirmação de ação destrutiva (excluir). `children` mostra o registro afetado. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isLoading,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">{description ?? "Esta ação não pode ser desfeita."}</p>
        </div>

        {children && (
          <div className="space-y-1 rounded-xl border border-border bg-muted/60 p-4">{children}</div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
