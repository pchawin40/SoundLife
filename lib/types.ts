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

export type CardType =
  | "lifestyle"
  | "sound"
  | "genre"
  | "antiGenre"
  | "mood"
  | "language"
  | "region";

export interface Scenario {
  id: ScenarioId;
  emoji: string;
  label: string;
  tagline: string;
  baseTraits: TraitScores;
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
  cardType?: CardType;
  /** CSS gradient for the card's visual area */
  gradient?: string;
  /** Genres to boost in results when right-swiped (genre cards) */
  boostGenres?: string[];
  /** Genres to filter out when right-swiped (antiGenre cards) */
  blockGenres?: string[];
  /** Languages to prefer in results when right-swiped */
  boostLanguages?: string[];
  /** Regions to prefer in results when right-swiped */
  boostRegions?: string[];
  /** Short explanation shown on flip: "why this matters" */
  whyText?: string;
  /** Optional editorial image path under /public */
  imageUrl?: string;
  /** Accessible description for the card image */
  imageAlt?: string;
  /** Prompt used to generate or brief the card image */
  visualPrompt?: string;
  /** Theme key for fallback styling when no image is available */
  visualTheme?: string;
}

export interface ReasonChip {
  emoji: string;
  label: string;
}

export interface SongPlatforms {
  spotifyUri?: string | null;
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
  /** ISO country code or readable name, e.g. "us", "kr", "nigeria". */
  country?: string;
  genres: string[];
  moods?: string[];
  era?: string | null;
  platforms: SongPlatforms;
  /** External stream-only preview URL, e.g. iTunes previewUrl. Never cached. */
  previewUrl?: string | null;
  /** External artwork URL, hotlinked from the catalog provider. */
  artworkUrl?: string | null;
  /** External iTunes track id returned by the iTunes Search API. */
  itunesTrackId?: string | null;
  traits: TraitScores;
  scenarios: ScenarioId[];
  chips: ReasonChip[];
  /** 0–100 nudge used as a deterministic tiebreaker, never a hard rank. */
  popularity?: number;
  explicit?: boolean;
  energy_level?: number;
  tempo_level?: number;
  lyric_density?: number;
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
  flag?: string;
  /** A song matches if its language, any genre, or region hits one of these. */
  languages?: string[];
  genres?: string[];
  regions?: string[];
}

export interface TraitStat {
  trait: Trait;
  percent: number;
}

export type RoastIntensity = "soft" | "accurate" | "roast";

export type ShareCardVariant = "story" | "identity" | "roast" | "aux";

export interface ArchetypeColorTheme {
  background: string;
  accent: string;
  text: string;
}

export interface SoundLifeArchetype {
  id: string;
  name: string;
  requiredTraits: Trait[];
  preferredScenarios: ScenarioId[];
  preferredGenres: string[];
  blockedGenres: string[];
  preferredLanguages: string[];
  diagnosis: string;
  softCopy: string;
  accurateCopy: string;
  roastCopy: string;
  bestFor: string;
  dangerousAround: string;
  shareCaption: string;
  colorTheme: ArchetypeColorTheme;
  emoji: string;
  sticker: string;
}

export interface ResultMatchReason {
  vibedWith: string[];
  rejected: string;
  strongestSignal: string;
  strongestSignalType: "trait" | "genre" | "language";
  avoided?: string[];
}

export interface SongScoreDebug {
  songId: string;
  title: string;
  artist: string;
  baseTraitScore: number;
  scenarioBonus: number;
  genreBonus: number;
  languageBonus: number;
  regionBonus: number;
  popularityBonus: number;
  dislikePenalty: number;
  blockedGenrePenalty: number;
  diversityPenalty: number;
  recentPenalty: number;
  finalScore: number;
  whyMatched: string[];
}

export interface ResultData {
  identity: string;
  archetype: SoundLifeArchetype;
  roastIntensity: RoastIntensity;
  resultCopy: string;
  whyMatched: ResultMatchReason;
  vibeTags: string[];
  matchPercent: number;
  traits: TraitStat[];
  songs: Song[];
  scoreDebug?: SongScoreDebug[];
  playlistWarnings?: string[];
  artists: string[];
  playlists: string[];
  scenarioId: ScenarioId;
  likedCount: number;
  superVibeCount: number;
  filterId: FilterId;
}

export type Step = "landing" | "scenario" | "swipe";

export type IdentityRarity = "common" | "uncommon" | "rare" | "legendary";

export interface SoundLifeCollectionItem {
  id: string;
  identity: string;
  archetypeId: string;
  scenarioId: ScenarioId;
  discoveredAt: string;
  topTraits: Trait[];
  matchPercent: number;
  rarity: IdentityRarity;
  sharePath: string;
}

export interface SoundLifeProfileState {
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  totalIdentities: number;
  collection: SoundLifeCollectionItem[];
}
