import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { useReveal } from "../hooks/use-reveal";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Atraso em ms (para escalonar itens de uma lista). */
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  /** Elemento renderizado (use "li" dentro de listas). */
  as?: "div" | "li";
}

/** Revela o conteúdo com fade + deslocamento quando ele entra na tela. */
export function Reveal({ delay = 0, from = "up", as: Tag = "div", className, style, children, ...props }: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-visible={visible}
      data-from={from}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
