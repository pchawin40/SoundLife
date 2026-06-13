import type {
  ArtistProfile,
  GlobalFilterOption,
  ScenarioId,
  Trait,
} from "./types";

/* ------------------------------------------------------------------ */
/* Traits                                                              */
/* ------------------------------------------------------------------ */

export const TRAITS: Trait[] = [
  "energy",
  "darkness",
  "tempo",
  "softness",
  "confidence",
  "chaos",
  "focus",
  "romance",
  "cinematic",
  "aggression",
  "warmth",
];

export const TRAIT_META: Record<
  Trait,
  { label: string; emoji: string; color: string; adjective: string }
> = {
  energy: { label: "Energy", emoji: "⚡", color: "#F0A82E", adjective: "High-Voltage" },
  darkness: { label: "Darkness", emoji: "🖤", color: "#7E57C2", adjective: "Dark" },
  tempo: { label: "Tempo", emoji: "🥁", color: "#26A69A", adjective: "Up-Tempo" },
  softness: { label: "Softness", emoji: "🪶", color: "#D9B98F", adjective: "Soft" },
  confidence: { label: "Confidence", emoji: "👑", color: "#D4860A", adjective: "Luxury" },
  chaos: { label: "Chaos", emoji: "🌪️", color: "#E2574C", adjective: "Chaotic" },
  focus: { label: "Focus", emoji: "🎯", color: "#4DB6AC", adjective: "Locked-In" },
  romance: { label: "Romance", emoji: "💘", color: "#E091B9", adjective: "Lovesick" },
  cinematic: { label: "Cinematic", emoji: "🎬", color: "#9575CD", adjective: "Cinematic" },
  aggression: { label: "Aggression", emoji: "🥊", color: "#D8552B", adjective: "Hard-Hitting" },
  warmth: { label: "Warmth", emoji: "🌅", color: "#E8A04C", adjective: "Golden" },
};

/** One-line editorial verdict keyed by the user's top trait. */
export const TRAIT_VERDICTS: Record<Trait, string> = {
  energy: "This sounds like sprinting up an escalator that's already going up.",
  darkness: "You're not moody. You're in post-production.",
  tempo: "This sounds like walking fast and ignoring texts.",
  softness: "Soft, but with excellent taste in heartbreak.",
  confidence: "Your music taste has main character damage.",
  chaos: "Beautiful chaos — the playlist version of fourteen open tabs.",
  focus: "Locked in. Your notifications are scared of you.",
  romance: "Lovesick, but make it a soundtrack.",
  cinematic: "You're not sad. You're cinematic.",
  aggression: "Gym villain arc unlocked.",
  warmth: "Global heat with late-night confidence.",
};

/* ------------------------------------------------------------------ */
/* Global mode / language filters                                      */
/* ------------------------------------------------------------------ */

export const GLOBAL_FILTERS: GlobalFilterOption[] = [
  { id: "global", label: "Global" },
  { id: "english", label: "English", languages: ["english"] },
  { id: "spanish", label: "Spanish", languages: ["spanish"], genres: ["reggaeton"] },
  { id: "korean", label: "Korean", languages: ["korean"], genres: ["k-pop"] },
  { id: "japanese", label: "Japanese", languages: ["japanese"], genres: ["j-pop"] },
  { id: "hindi", label: "Hindi", languages: ["hindi"], genres: ["bollywood"] },
  { id: "portuguese", label: "Portuguese", languages: ["portuguese"], regions: ["brazil"] },
  { id: "french", label: "French", languages: ["french"] },
  {
    id: "afrobeats",
    label: "Afrobeats",
    genres: ["afrobeats", "amapiano"],
    regions: ["nigeria", "south-africa", "ghana"],
  },
  { id: "arabic", label: "Arabic", languages: ["arabic"], genres: ["arab-pop"] },
  { id: "punjabi", label: "Punjabi", languages: ["punjabi"], genres: ["punjabi"] },
  { id: "thai", label: "Thai", languages: ["thai"], genres: ["thai-pop"], regions: ["thailand"] },
];

/* ------------------------------------------------------------------ */
/* Artist discovery pool (beyond the artists in the song list)         */
/* ------------------------------------------------------------------ */

export const ARTIST_POOL: ArtistProfile[] = [
  { name: "Hans Zimmer", traits: { cinematic: 3, focus: 2, darkness: 1 }, scenarios: ["focus", "drive"] },
  { name: "Kaytranada", traits: { tempo: 2, warmth: 2, energy: 1 }, scenarios: ["party", "chill"] },
  { name: "Bicep", traits: { energy: 2, focus: 2, tempo: 2 }, scenarios: ["party", "focus", "drive"] },
  { name: "Sade", traits: { softness: 3, romance: 2, warmth: 2 }, scenarios: ["chill", "sad"] },
  { name: "Run The Jewels", traits: { aggression: 3, energy: 2, confidence: 2 }, scenarios: ["gym"] },
  { name: "The Neighbourhood", traits: { darkness: 2, romance: 2, cinematic: 1 }, scenarios: ["sad", "drive"] },
  { name: "Polo & Pan", traits: { warmth: 2, tempo: 2, softness: 1 }, scenarios: ["chill", "party"] },
  { name: "Cigarettes After Sex", traits: { romance: 3, softness: 2, darkness: 1 }, scenarios: ["sad", "chill"] },
  { name: "Justice", traits: { energy: 2, darkness: 2, cinematic: 2, tempo: 2 }, scenarios: ["party", "drive", "gym"] },
  { name: "Jorja Smith", traits: { softness: 2, romance: 2, warmth: 2 }, scenarios: ["chill", "sad", "focus"] },
  { name: "Tems", traits: { warmth: 2, softness: 2, romance: 2 }, scenarios: ["chill", "sad"] },
  { name: "Peso Pluma", traits: { confidence: 2, energy: 2, warmth: 1 }, scenarios: ["party", "drive"] },
  { name: "IVE", traits: { confidence: 2, tempo: 2, energy: 1 }, scenarios: ["party", "gym"] },
  { name: "Stray Kids", traits: { energy: 2, aggression: 2, chaos: 2 }, scenarios: ["gym", "party"] },
  { name: "Diljit Dosanjh", traits: { energy: 2, warmth: 2, confidence: 1 }, scenarios: ["party", "drive"] },
  { name: "Asake", traits: { tempo: 2, energy: 2, warmth: 1 }, scenarios: ["party", "chill"] },
];

/* ------------------------------------------------------------------ */
/* Identity rules + playlist banks                                     */
/* ------------------------------------------------------------------ */

export interface IdentityRule {
  /** Scenarios this rule applies to, or "any". */
  scenarios: ScenarioId[] | "any";
  /** Every listed trait must appear in the user's top 3. */
  traits: Trait[];
  title: string;
}

export const IDENTITY_RULES: IdentityRule[] = [
  { scenarios: ["drive"], traits: ["darkness", "cinematic"], title: "Dark Cinematic Drive Energy" },
  { scenarios: ["drive"], traits: ["warmth"], title: "Golden Hour Cruise" },
  { scenarios: ["drive"], traits: ["tempo", "energy"], title: "Full Send Highway" },
  { scenarios: ["gym"], traits: ["aggression", "confidence"], title: "Gym Villain Arc" },
  { scenarios: ["gym"], traits: ["darkness"], title: "Gym Villain Arc" },
  { scenarios: ["gym"], traits: ["tempo"], title: "Heart Rate Hero" },
  { scenarios: ["focus"], traits: ["energy"], title: "Focus Mode Synthwave" },
  { scenarios: ["focus"], traits: ["tempo"], title: "Focus Mode Synthwave" },
  { scenarios: ["focus"], traits: ["darkness", "cinematic"], title: "Midnight Deep Work" },
  { scenarios: ["focus"], traits: ["softness"], title: "Soft Focus Study Glow" },
  { scenarios: ["party"], traits: ["confidence", "darkness"], title: "Luxury Night Out" },
  { scenarios: ["party"], traits: ["confidence"], title: "Bass-Heavy Confidence" },
  { scenarios: ["sad"], traits: ["tempo"], title: "Sad But Still Moving" },
  { scenarios: ["sad"], traits: ["energy"], title: "Sad But Still Moving" },
  { scenarios: ["sad"], traits: ["softness", "darkness"], title: "Rainy Window Indie" },
  { scenarios: ["sad"], traits: ["romance", "cinematic"], title: "Heartbreak Montage Core" },
  { scenarios: ["chill"], traits: ["warmth"], title: "Golden Hour Chill" },
  { scenarios: "any", traits: ["softness", "chaos"], title: "Soft Chaos R&B" },
  { scenarios: "any", traits: ["cinematic", "confidence"], title: "Main Character Pop" },
  { scenarios: "any", traits: ["confidence", "energy"], title: "Bass-Heavy Confidence" },
];

/** Used when no identity rule matches: "{adj} {adj} {noun}". */
export const SCENARIO_IDENTITY_NOUN: Record<ScenarioId, string> = {
  drive: "Drive Energy",
  gym: "Gym Arc",
  focus: "Focus Flow",
  party: "Party Era",
  sad: "Heartbreak Hours",
  chill: "Chill",
  random: "Wildcard Era",
};

export const SCENARIO_PLAYLISTS: Record<ScenarioId, [string, string]> = {
  drive: ["windows down, volume up", "3AM on the interstate"],
  gym: ["one more rep", "villain arc cardio"],
  focus: ["deep work, do not disturb", "tabs closed, mind open"],
  party: ["we move at midnight", "main character at the function"],
  sad: ["crying, but make it cinematic", "healing montage"],
  chill: ["golden hour, no agenda", "soft life soundtrack"],
  random: ["chaos, curated", "the algorithm of me"],
};

export const TRAIT_PLAYLISTS: Record<Trait, string> = {
  energy: "heart rate: elevated",
  darkness: "after dark frequencies",
  tempo: "BPM therapy",
  softness: "feather-light hours",
  confidence: "untouchable era",
  chaos: "beautiful chaos",
  focus: "tunnel vision",
  romance: "lovesick frequencies",
  cinematic: "score for an imaginary film",
  aggression: "controlled aggression",
  warmth: "sun-warmed and unbothered",
};
