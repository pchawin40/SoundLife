export type Trait =
  | "energy"
  | "darkness"
  | "tempo"
  | "softness"
  | "confidence"
  | "chaos"
  | "focus"
  | "romance"
  | "cinematic"
  | "aggression"
  | "warmth";

export type TraitScores = Partial<Record<Trait, number>>;

export type ScenarioId =
  | "drive"
  | "gym"
  | "focus"
  | "party"
  | "sad"
  | "chill"
  | "random";

export interface Scenario {
  id: ScenarioId;
  emoji: string;
  label: string;
  tagline: string;
  baseTraits: TraitScores;
  /** Vibe card ids shown for this scenario. Empty for "random" (drawn at runtime). */
  deck: string[];
}

export interface VibeCardData {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  traits: TraitScores;
  /** Tiny toast shown after a right swipe, e.g. "+ Dark" */
  feedback: string;
}

export interface ReasonChip {
  emoji: string;
  label: string;
}

export interface SongPlatforms {
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
  youtubeMusicUrl?: string | null;
  youtubeVideoId?: string | null;
}

export interface Song {
  /** Slug for local songs, uuid for Supabase rows. */
  id: string;
  title: string;
  artist: string;
  /** Lowercase, e.g. "english", "korean", "instrumental". */
  language: string;
  /** Lowercase slug, e.g. "north-america", "nigeria", "south-asia". */
  region: string;
  genres: string[];
  era?: string | null;
  platforms: SongPlatforms;
  traits: TraitScores;
  scenarios: ScenarioId[];
  chips: ReasonChip[];
  /** 0–100 nudge used as a deterministic tiebreaker, never a hard rank. */
  popularity?: number;
}

export interface ArtistProfile {
  name: string;
  traits: TraitScores;
  scenarios: ScenarioId[];
}

/** The full dataset the engine runs on — local fallback, cached, or Supabase. */
export interface Catalog {
  version: number;
  songs: Song[];
  vibeCards: VibeCardData[];
  scenarios: Scenario[];
}

export type FilterId =
  | "global"
  | "english"
  | "spanish"
  | "korean"
  | "japanese"
  | "hindi"
  | "portuguese"
  | "french"
  | "afrobeats"
  | "arabic"
  | "punjabi"
  | "thai";

export interface GlobalFilterOption {
  id: FilterId;
  label: string;
  /** A song matches if its language, any genre, or region hits one of these. */
  languages?: string[];
  genres?: string[];
  regions?: string[];
}

export interface TraitStat {
  trait: Trait;
  percent: number;
}

export interface ResultData {
  identity: string;
  matchPercent: number;
  traits: TraitStat[];
  songs: Song[];
  artists: string[];
  playlists: string[];
  scenarioId: ScenarioId;
  likedCount: number;
  filterId: FilterId;
}

export type Step = "landing" | "scenario" | "swipe";
