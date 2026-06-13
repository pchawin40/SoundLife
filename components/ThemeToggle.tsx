"use client";

import { useEffect, useState } from "react";
import { applyTheme, getThemeMode, setThemeMode, type ThemeMode } from "@/lib/theme";

const OPTIONS: Array<{ id: ThemeMode; label: string; icon: string }> = [
  { id: "light", label: "Light", icon: "☀" },
  { id: "system", label: "System", icon: "◐" },
  { id: "dark", label: "Dark", icon: "☾" },
];

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getThemeMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const choose = (next: ThemeMode) => {
    setMode(next);
    setThemeMode(next);
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-border bg-surface/80 p-1 shadow-sm backdrop-blur ${className}`}
      role="radiogroup"
      aria-label="Color theme"
    >
      {OPTIONS.map((option) => {
        const active = mounted && mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => choose(option.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors ${
              active
                ? "bg-ink text-paper"
                : "text-subtle hover:bg-gray-100 hover:text-ink"
            }`}
          >
            <span aria-hidden>{option.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
