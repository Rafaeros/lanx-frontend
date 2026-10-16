import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/hooks/use-theme";
import { Button } from "./button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={resolvedTheme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className={className}
      aria-label="Alternar tema"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[18px] w-[18px] text-warning" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-muted-foreground" />
      )}
    </Button>
  );
}

