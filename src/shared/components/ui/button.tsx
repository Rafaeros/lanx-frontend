import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[#7609e8] text-white hover:bg-[#6407c7] focus:ring-[#7609e8] shadow-sm",
      gradient:
        "bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-blue)] text-white hover:opacity-95 shadow-md hover:shadow-lg focus:ring-[var(--brand-purple)]",
      secondary:
        "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80 border border-[var(--card-border)]",
      outline:
        "bg-transparent border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--muted)] focus:ring-[var(--brand-purple)]",
      ghost:
        "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] focus:ring-[var(--card-border)]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

