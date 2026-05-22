import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

interface DarkModeToggleProps {
  className?: string;
}

export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative w-9 h-9 rounded-lg flex items-center justify-center",
        "border border-neutral-200 dark:border-neutral-700",
        "bg-white dark:bg-neutral-800",
        "text-neutral-500 dark:text-neutral-400",
        "hover:bg-neutral-100 dark:hover:bg-neutral-700",
        "transition-all duration-200",
        className
      )}
    >
      <Sun
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
