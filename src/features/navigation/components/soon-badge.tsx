import { cn } from "@/shared/lib/utils";

export function SoonBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground",
        className
      )}
    >
      Em breve
    </span>
  );
}
