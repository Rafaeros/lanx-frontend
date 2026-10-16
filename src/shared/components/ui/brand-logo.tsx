import type * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  caption?: React.ReactNode;
  className?: string;
}

const markSizes = {
  sm: "h-8 w-8 text-base rounded-lg",
  md: "h-9 w-9 text-lg rounded-xl",
  lg: "h-12 w-12 text-2xl rounded-2xl",
};

/** Marca LANX: monograma em gradiente + nome. Fonte única para header, sidebar e login. */
export function BrandLogo({ size = "md", showName = true, caption, className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-gradient-to-tr from-brand-purple to-brand-blue font-display font-bold text-white shadow-sm",
          markSizes[size]
        )}
        aria-hidden="true"
      >
        L
      </div>
      {showName && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">LANX</span>
          {caption && <span className="mt-1 text-xs text-muted-foreground">{caption}</span>}
        </div>
      )}
    </div>
  );
}
