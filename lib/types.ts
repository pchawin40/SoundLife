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

export interface Song {
  title: string;
  artist: string;
  traits: TraitScores;
  scenarios: ScenarioId[];
  chips: ReasonChip[];
}

export interface ArtistProfile {
  name: string;
  traits: TraitScores;
  scenarios: ScenarioId[];
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
}

export type Step = "landing" | "scenario" | "swipe" | "building" | "results";
