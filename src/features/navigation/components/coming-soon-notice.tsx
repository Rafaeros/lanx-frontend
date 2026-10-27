import { Hourglass } from "lucide-react";
import type { ModuleDefinition } from "../types";

export function ComingSoonNotice({ module }: { module: ModuleDefinition }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Hourglass className="h-4 w-4 text-primary" />
        {module.label} ainda está por vir
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        As telas deste módulo estão em desenvolvimento. Enquanto isso, troque de módulo pelo
        seletor acima.
      </p>
    </div>
  );
}
