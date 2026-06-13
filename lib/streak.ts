import { toUtcDateKey } from "./daily";
import type {
  IdentityRarity,
  ResultData,
  SoundLifeCollectionItem,
  SoundLifeProfileState,
  Trait,
} from "./types";

export const EMPTY_PROFILE_STATE: SoundLifeProfileState = {
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  totalIdentities: 0,
  collection: [],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dateKeyToDayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function daysBetween(previous: string, next: string): number {
  return dateKeyToDayNumber(next) - dateKeyToDayNumber(previous);
}

function comboHash(traits: Trait[]): number {
  const key = [...traits].sort().join("|");
  let hash = 5381;
  for (let i = 0; i < key.length; i += 1) {
    hash = (Math.imul(hash, 33) ^ key.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
}

export function deriveIdentityRarity(
  traits: Trait[],
  matchPercent: number
): IdentityRarity {
  const rarityScore = Math.round(comboHash(traits) * 0.65 + Math.max(0, matchPercent - 70) * 1.4);
  if (rarityScore >= 82) return "legendary";
  if (rarityScore >= 62) return "rare";
  if (rarityScore >= 38) return "uncommon";
  return "common";
}

export function makeCollectionItem(
  result: ResultData,
  sharePath: string,
  playedDate: Date | string = new Date()
): SoundLifeCollectionItem {
  const discoveredAt = toUtcDateKey(playedDate);
  const topTraits = result.traits.slice(0, 3).map((stat) => stat.trait);
  return {
    id: `${discoveredAt}:${result.archetype.id}:${slugify(topTraits.join("-"))}`,
    identity: result.identity,
    archetypeId: result.archetype.id,
    scenarioId: result.scenarioId,
    discoveredAt,
    topTraits,
    matchPercent: result.matchPercent,
    rarity: deriveIdentityRarity(topTraits, result.matchPercent),
    sharePath,
  };
}

export function normalizeProfileState(
  state: Partial<SoundLifeProfileState> | null | undefined
): SoundLifeProfileState {
  const collection = Array.isArray(state?.collection) ? state.collection : [];
  return {
    currentStreak: Math.max(0, Number(state?.currentStreak ?? 0)),
    maxStreak: Math.max(0, Number(state?.maxStreak ?? 0)),
    lastPlayedDate: state?.lastPlayedDate ?? null,
    totalIdentities: Math.max(0, Number(state?.totalIdentities ?? collection.length)),
    collection,
  };
}

export function updateSoundLifeProfile(
  previousState: Partial<SoundLifeProfileState> | null | undefined,
  today: Date | string,
  discovered?: SoundLifeCollectionItem
): SoundLifeProfileState {
  const state = normalizeProfileState(previousState);
  const todayKey = toUtcDateKey(today);

  let currentStreak = state.currentStreak;
  if (!state.lastPlayedDate) {
    currentStreak = discovered ? 1 : currentStreak;
  } else {
    const gap = daysBetween(state.lastPlayedDate, todayKey);
    if (gap === 0) {
      currentStreak = Math.max(currentStreak, discovered ? 1 : 0);
    } else if (gap === 1) {
      currentStreak += 1;
    } else if (gap === 2) {
      currentStreak = Math.max(currentStreak, 1);
    } else if (gap > 2) {
      currentStreak = discovered ? 1 : 0;
    }
  }

  const collection = discovered
    ? [
        discovered,
        ...state.collection.filter((item) => item.id !== discovered.id),
      ].slice(0, 48)
    : state.collection;

  return {
    currentStreak,
    maxStreak: Math.max(state.maxStreak, currentStreak),
    lastPlayedDate: discovered ? todayKey : state.lastPlayedDate,
    totalIdentities: collection.length,
    collection,
  };
}
