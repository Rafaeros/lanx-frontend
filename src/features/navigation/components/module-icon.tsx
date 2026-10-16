import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import { moduleAccentVar } from "../config/modules";
import type { ModuleDefinition } from "../types";

const sizes = {
  xs: { box: "h-6 w-6 rounded-md", icon: "h-3.5 w-3.5" },
  sm: { box: "h-8 w-8 rounded-lg", icon: "h-4 w-4" },
  md: { box: "h-9 w-9 rounded-lg", icon: "h-[18px] w-[18px]" },
  lg: { box: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
};

/** Ícone do módulo sobre um fundo na cor do módulo. */
export function ModuleIcon({
  module,
  size = "md",
  className,
}: {
  module: ModuleDefinition;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const Icon = module.icon;
  return (
    <span
      style={{ "--accent": moduleAccentVar(module.id) } as React.CSSProperties}
      className={cn("accent-icon flex shrink-0 items-center justify-center", sizes[size].box, className)}
    >
      <Icon className={sizes[size].icon} />
    </span>
  );
}
