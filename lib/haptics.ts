import { getStorageJson, setStorageJson } from "./storage";

const HAPTICS_KEY = "haptics";

export function getHapticsEnabled(): boolean {
  return getStorageJson(HAPTICS_KEY, true);
}

export function setHapticsEnabled(enabled: boolean): boolean {
  return setStorageJson(HAPTICS_KEY, enabled);
}

export function vibrate(pattern: number | number[] = 12): void {
  if (typeof navigator === "undefined") return;
  if (!getHapticsEnabled()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Haptics are a nice-to-have signal only.
  }
}
