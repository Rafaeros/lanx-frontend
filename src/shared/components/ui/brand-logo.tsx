import type * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  /** Texto pequeno abaixo da logo (ex.: módulo ativo na sidebar). */
  caption?: React.ReactNode;
  className?: string;
}

/** Altura da logo; a largura acompanha a proporção da imagem (~2,8 : 1). */
const heights = {
  sm: "h-7",
  md: "h-9",
  lg: "h-14",
};

/**
 * Logo LANX Cables. Fonte única para header, sidebar, login e rodapé.
 * Arquivos em public/brand (gerados a partir de public/hero.png): a versão
 * escura troca o "CABLES" preto por branco para aparecer no tema escuro.
 */
export function BrandLogo({ size = "md", caption, className }: BrandLogoProps) {
  const img = cn("w-auto shrink-0 select-none", heights[size]);
  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <img src="/brand/logo.png" alt="LANX Cables" className={cn(img, "dark:hidden")} draggable={false} />
      <img
        src="/brand/logo-dark.png"
        alt="LANX Cables"
        className={cn(img, "hidden dark:block")}
        draggable={false}
      />
      {caption && <span className="mt-1.5 text-xs text-muted-foreground">{caption}</span>}
    </div>
  );
}
