import { getStorageValue, setStorageValue } from "./storage";

export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export function getThemeMode(): ThemeMode {
  const value = getStorageValue(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemPrefersDark();
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolveDark(mode));
}

export function setThemeMode(mode: ThemeMode): void {
  setStorageValue(THEME_STORAGE_KEY, mode);
  applyTheme(mode);
}
