import * as React from "react";
import { createPortal } from "react-dom";

interface Position {
  top: number;
  left: number;
}

/**
 * Rótulo flutuante à direita do item, usado na sidebar recolhida. Vai para o <body> via portal
 * porque a área de navegação rola (overflow) e cortaria um tooltip posicionado dentro dela.
 */
export function SidebarTooltip({
  label,
  enabled,
  children,
}: {
  label: React.ReactNode;
  enabled: boolean;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [position, setPosition] = React.useState<Position | null>(null);

  if (!enabled) return <>{children}</>;

  const show = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.top + rect.height / 2, left: rect.right + 10 });
  };
  const hide = () => setPosition(null);

  return (
    <span
      ref={ref}
      className="block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={hide}
    >
      {children}
      {position &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: position.top, left: position.left }}
            className="pointer-events-none fixed z-[60] -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-lg animate-fade-in"
          >
            {label}
          </span>,
          document.body
        )}
    </span>
  );
}
