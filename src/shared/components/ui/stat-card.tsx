import type * as React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/shared/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  detail?: React.ReactNode;
  icon: React.ElementType;
  /** Classes do círculo do ícone, ex.: "bg-success/10 text-success". */
  tone: string;
  valueClassName?: string;
}

/** Card de indicador dos relatórios: rótulo, número grande, detalhe e ícone colorido. */
export function StatCard({ label, value, detail, icon: Icon, tone, valueClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p
            className={cn("mt-1 truncate font-display text-2xl font-semibold tabular-nums text-foreground", valueClassName)}
            title={value}
          >
            {value}
          </p>
          {detail && <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
