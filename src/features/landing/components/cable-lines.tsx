import { cn } from "@/shared/lib/utils";

/** Curvas que lembram cabos: base traçada uma vez e um pulso de luz percorrendo cada uma. Decorativo. */
const PATHS = [
  "M-40 420 C 180 300, 340 520, 620 380 S 1020 180, 1480 300",
  "M-40 470 C 220 380, 380 600, 660 440 S 1060 260, 1480 360",
  "M-40 520 C 260 460, 420 660, 700 500 S 1100 340, 1480 420",
  "M-40 570 C 300 540, 460 700, 740 560 S 1140 420, 1480 480",
];

export function CableLines({ className, id = "cable" }: { className?: string; id?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--brand-from)" }} />
          <stop offset="100%" style={{ stopColor: "var(--brand-to)" }} />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <g key={d}>
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke={`url(#${id}-stroke)`}
            strokeWidth={i === 1 ? 2.5 : 1.5}
            strokeOpacity={0.35}
            className="cable-path"
            style={{ animationDelay: `${i * 180}ms` }}
          />
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke={`url(#${id}-stroke)`}
            strokeWidth={i === 1 ? 4 : 3}
            strokeLinecap="round"
            className="cable-pulse"
            style={{ animationDelay: `${2400 + i * 1100}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}
