const STORAGE_PREFIX = "soundlife";

export const STORAGE_VERSION = 1;
export const STORAGE_VERSION_KEY = `${STORAGE_PREFIX}:version`;

function scopedKey(key: string): string {
  return key.startsWith(`${STORAGE_PREFIX}:`) ? key : `${STORAGE_PREFIX}:${key}`;
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getStorageValue(key: string): string | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  try {
    return storage.getItem(scopedKey(key));
  } catch {
    return null;
  }
}

export function setStorageValue(key: string, value: string): boolean {
  const storage = getLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(scopedKey(key), value);
    storage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
    return true;
  } catch {
    return false;
  }
}

export function removeStorageValue(key: string): boolean {
  const storage = getLocalStorage();
  if (!storage) return false;
  try {
    storage.removeItem(scopedKey(key));
    return true;
  } catch {
    return false;
  }
}

export function getStorageJson<T>(key: string, fallback: T): T {
  const raw = getStorageValue(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageJson<T>(key: string, value: T): boolean {
  return setStorageValue(key, JSON.stringify(value));
}

export function getStorageVersion(): number {
  const raw = getStorageValue(STORAGE_VERSION_KEY);
  const version = Number(raw);
  return Number.isFinite(version) ? version : 0;
}
