import { ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { usePrefersReducedMotion, useScrollY } from "../hooks/use-scroll-y";

/** Botão flutuante no canto inferior direito: aparece depois da primeira dobra e volta ao topo. */
export function BackToTop() {
  const y = useScrollY();
  const reduced = usePrefersReducedMotion();
  const visible = typeof window !== "undefined" && y > window.innerHeight * 0.8;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label="Voltar ao início da página"
      title="Voltar ao início"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg shadow-primary/30 sm:bottom-8 sm:right-8",
        "transition-[opacity,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
