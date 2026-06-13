import type { ScenarioId } from "./types";

const DAILY_SCENARIOS: ScenarioId[] = [
  "drive",
  "gym",
  "focus",
  "party",
  "sad",
  "chill",
  "random",
];

export interface DailyPrompt {
  date: string;
  scenarioId: ScenarioId;
  seed: number;
}

export function toUtcDateKey(input: Date | string = new Date()): string {
  if (typeof input === "string") return input.slice(0, 10);
  const year = input.getUTCFullYear();
  const month = String(input.getUTCMonth() + 1).padStart(2, "0");
  const day = String(input.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashDateKey(dateKey: string): number {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getDailyPrompt(input: Date | string = new Date()): DailyPrompt {
  const date = toUtcDateKey(input);
  const seed = hashDateKey(date);
  return {
    date,
    seed,
    scenarioId: DAILY_SCENARIOS[seed % DAILY_SCENARIOS.length],
  };
}
