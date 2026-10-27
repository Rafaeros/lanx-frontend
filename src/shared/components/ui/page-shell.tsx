import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface PageShellProps {
  /**
   * Telas de listagem: no desktop (lg+) a tela ocupa exatamente a altura disponível e só as
   * linhas da tabela rolam. No mobile a página rola normalmente.
   */
  fill?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Contêiner padrão das telas internas: empilha cabeçalho, filtros e conteúdo com o mesmo espaçamento.
 * Sem `fill`, não encolhe: a página fica com a altura do conteúdo e o <main> rola (senão a tabela era
 * espremida até a altura da tela e a paginação saía cortada).
 */
export function PageShell({ fill, className, children }: PageShellProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 lg:gap-5", fill ? "lg:h-full lg:min-h-0" : "shrink-0 pb-2", className)}>
      {children}
    </div>
  );
}
