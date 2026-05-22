// src/hooks/useDarkMode.ts
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Cek localStorage dulu
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) return stored;

    // Fallback ke system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen perubahan system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      // Hanya update kalau user belum pernah set manual
      if (!stored) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  return { theme, toggleTheme, setLight, setDark, isDark: theme === "dark" };
}
