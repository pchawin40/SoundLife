import type {
  ArtistProfile,
  Scenario,
  ScenarioId,
  Song,
  Trait,
  VibeCardData,
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

/* ------------------------------------------------------------------ */
/* Vibe cards                                                          */
/* ------------------------------------------------------------------ */

export const VIBE_CARDS: VibeCardData[] = [
  {
    id: "late-night-highway",
    emoji: "🌙",
    title: "Late-night highway",
    subtitle: "Empty roads, heavy thoughts",
    traits: { darkness: 2, cinematic: 2, focus: 1 },
    feedback: "+ Dark",
  },
  {
    id: "spicy-food",
    emoji: "🌶️",
    title: "Spicy food",
    subtitle: "You like intensity",
    traits: { energy: 2, aggression: 1, chaos: 1 },
    feedback: "+ Intensity",
  },
  {
    id: "boxing",
    emoji: "🥊",
    title: "Boxing",
    subtitle: "Focused aggression",
    traits: { aggression: 2, energy: 2, focus: 1 },
    feedback: "+ Aggression",
  },
  {
    id: "coffee-shop",
    emoji: "☕",
    title: "Coffee shop",
    subtitle: "Soft focus mode",
    traits: { softness: 2, focus: 2, warmth: 1 },
    feedback: "+ Soft",
  },
  {
    id: "rainy-days",
    emoji: "🌧️",
    title: "Rainy days",
    subtitle: "Melancholy but cozy",
    traits: { darkness: 1, softness: 2, romance: 1 },
    feedback: "+ Melancholy",
  },
  {
    id: "beach-sunset",
    emoji: "🏖️",
    title: "Beach sunset",
    subtitle: "Warm, open, relaxed",
    traits: { warmth: 2, softness: 1, romance: 1 },
    feedback: "+ Warmth",
  },
  {
    id: "restless-energy",
    emoji: "⚡",
    title: "Restless energy",
    subtitle: "You need motion",
    traits: { energy: 2, tempo: 2, chaos: 1 },
    feedback: "+ Energy",
  },
  {
    id: "dark-rooms",
    emoji: "🖤",
    title: "Dark rooms",
    subtitle: "Moody and cinematic",
    traits: { darkness: 2, cinematic: 2 },
    feedback: "+ Cinematic",
  },
  {
    id: "dance-floor",
    emoji: "🕺",
    title: "Dance floor",
    subtitle: "You want movement",
    traits: { tempo: 2, energy: 2, confidence: 1 },
    feedback: "+ Movement",
  },
  {
    id: "deep-work",
    emoji: "🧠",
    title: "Deep work",
    subtitle: "No lyrics, just flow",
    traits: { focus: 2, tempo: 1 },
    feedback: "+ Focus",
  },
  {
    id: "main-character",
    emoji: "🔥",
    title: "Main character",
    subtitle: "You want drama",
    traits: { cinematic: 2, confidence: 2 },
    feedback: "+ Drama",
  },
  {
    id: "rage-cleaning",
    emoji: "🧹",
    title: "Rage cleaning",
    subtitle: "Productive chaos",
    traits: { chaos: 2, energy: 1, aggression: 1 },
    feedback: "+ Chaos",
  },
  {
    id: "heartbreak-montage",
    emoji: "💔",
    title: "Heartbreak montage",
    subtitle: "Sad but beautiful",
    traits: { romance: 2, darkness: 1, cinematic: 1 },
    feedback: "+ Feels",
  },
  {
    id: "feeling-expensive",
    emoji: "🤑",
    title: "Feeling expensive",
    subtitle: "Luxury confidence",
    traits: { confidence: 2, cinematic: 1 },
    feedback: "+ Luxury",
  },
  {
    id: "road-trip",
    emoji: "🛣️",
    title: "Road trip",
    subtitle: "Forward motion",
    traits: { tempo: 1, warmth: 1, energy: 1, cinematic: 1 },
    feedback: "+ Motion",
  },
];

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

export const SCENARIOS: Scenario[] = [
  {
    id: "drive",
    emoji: "🚗",
    label: "Drive",
    tagline: "Windows down or midnight run",
    baseTraits: { cinematic: 2, tempo: 1, energy: 1 },
    deck: [
      "late-night-highway",
      "road-trip",
      "dark-rooms",
      "main-character",
      "beach-sunset",
      "rainy-days",
      "restless-energy",
    ],
  },
  {
    id: "gym",
    emoji: "🏋️",
    label: "Gym",
    tagline: "Lift heavy, feel unstoppable",
    baseTraits: { energy: 2, aggression: 2, tempo: 1 },
    deck: [
      "boxing",
      "restless-energy",
      "main-character",
      "feeling-expensive",
      "spicy-food",
      "dark-rooms",
      "rage-cleaning",
    ],
  },
  {
    id: "focus",
    emoji: "💻",
    label: "Focus",
    tagline: "Lock in, tune out",
    baseTraits: { focus: 2, softness: 1 },
    deck: [
      "deep-work",
      "coffee-shop",
      "rainy-days",
      "dark-rooms",
      "restless-energy",
      "late-night-highway",
      "feeling-expensive",
    ],
  },
  {
    id: "party",
    emoji: "🎉",
    label: "Party",
    tagline: "Tonight has potential",
    baseTraits: { energy: 2, tempo: 2, chaos: 1 },
    deck: [
      "dance-floor",
      "spicy-food",
      "feeling-expensive",
      "main-character",
      "restless-energy",
      "beach-sunset",
      "dark-rooms",
    ],
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    tagline: "Feel it all the way through",
    baseTraits: { darkness: 1, softness: 1, romance: 1 },
    deck: [
      "heartbreak-montage",
      "rainy-days",
      "late-night-highway",
      "dark-rooms",
      "coffee-shop",
      "main-character",
      "beach-sunset",
    ],
  },
  {
    id: "chill",
    emoji: "😌",
    label: "Chill",
    tagline: "Low stakes, high vibes",
    baseTraits: { softness: 2, warmth: 2 },
    deck: [
      "beach-sunset",
      "coffee-shop",
      "rainy-days",
      "road-trip",
      "deep-work",
      "heartbreak-montage",
      "feeling-expensive",
    ],
  },
  {
    id: "random",
    emoji: "🎲",
    label: "Random Me",
    tagline: "Surprise me, I contain multitudes",
    baseTraits: {},
    deck: [],
  },
];

/* ------------------------------------------------------------------ */
/* Songs                                                               */
/* ------------------------------------------------------------------ */

export const SONGS: Song[] = [
  {
    title: "After Hours",
    artist: "The Weeknd",
    traits: { darkness: 3, cinematic: 2, energy: 2, tempo: 1 },
    scenarios: ["drive", "sad"],
    chips: [
      { emoji: "🌙", label: "Night drive" },
      { emoji: "🖤", label: "Dark" },
      { emoji: "⚡", label: "High energy" },
    ],
  },
  {
    title: "HUMBLE.",
    artist: "Kendrick Lamar",
    traits: { confidence: 3, aggression: 2, energy: 2 },
    scenarios: ["gym", "party", "drive"],
    chips: [
      { emoji: "👑", label: "Confidence" },
      { emoji: "🥊", label: "Hard-hitting" },
    ],
  },
  {
    title: "The Search",
    artist: "NF",
    traits: { aggression: 2, darkness: 2, energy: 2, focus: 1 },
    scenarios: ["gym", "drive"],
    chips: [
      { emoji: "🥊", label: "Aggression" },
      { emoji: "🧠", label: "Introspective" },
    ],
  },
  {
    title: "Pursuit",
    artist: "Gesaffelstein",
    traits: { darkness: 3, aggression: 2, cinematic: 2, tempo: 2 },
    scenarios: ["gym", "drive", "party"],
    chips: [
      { emoji: "🖤", label: "Dark techno" },
      { emoji: "🎬", label: "Cinematic" },
      { emoji: "⚡", label: "Relentless" },
    ],
  },
  {
    title: "POWER",
    artist: "Kanye West",
    traits: { confidence: 3, energy: 3, aggression: 1 },
    scenarios: ["gym", "party"],
    chips: [
      { emoji: "👑", label: "Main character" },
      { emoji: "⚡", label: "Energy" },
    ],
  },
  {
    title: "goosebumps",
    artist: "Travis Scott",
    traits: { darkness: 2, energy: 2, chaos: 1, tempo: 1 },
    scenarios: ["party", "drive", "gym"],
    chips: [
      { emoji: "🌙", label: "Late night" },
      { emoji: "🌪️", label: "Hypnotic" },
    ],
  },
  {
    title: "Good Days",
    artist: "SZA",
    traits: { softness: 3, warmth: 2, romance: 2 },
    scenarios: ["chill", "sad", "focus"],
    chips: [
      { emoji: "🪶", label: "Soft" },
      { emoji: "🌅", label: "Warm glow" },
    ],
  },
  {
    title: "Nights",
    artist: "Frank Ocean",
    traits: { softness: 2, romance: 2, cinematic: 2, darkness: 1 },
    scenarios: ["sad", "chill", "drive"],
    chips: [
      { emoji: "💔", label: "Two moods" },
      { emoji: "🌙", label: "Late night" },
    ],
  },
  {
    title: "bury a friend",
    artist: "Billie Eilish",
    traits: { darkness: 3, chaos: 2, cinematic: 1 },
    scenarios: ["sad", "drive", "gym"],
    chips: [
      { emoji: "🖤", label: "Eerie" },
      { emoji: "🌪️", label: "Unhinged" },
    ],
  },
  {
    title: "A Moment Apart",
    artist: "ODESZA",
    traits: { cinematic: 3, warmth: 2, energy: 1, focus: 1 },
    scenarios: ["focus", "chill", "drive"],
    chips: [
      { emoji: "🎬", label: "Cinematic" },
      { emoji: "🌅", label: "Euphoric" },
    ],
  },
  {
    title: "Passionfruit",
    artist: "Drake",
    traits: { softness: 2, warmth: 2, romance: 2, tempo: 1 },
    scenarios: ["chill", "party", "sad"],
    chips: [
      { emoji: "🏝️", label: "Tropical" },
      { emoji: "🪶", label: "Smooth" },
    ],
  },
  {
    title: "Superhero (Heroes & Villains)",
    artist: "Metro Boomin",
    traits: { darkness: 2, confidence: 2, cinematic: 2 },
    scenarios: ["gym", "drive", "party"],
    chips: [
      { emoji: "🎬", label: "Villain arc" },
      { emoji: "🖤", label: "Dark" },
    ],
  },
  {
    title: "See You Again",
    artist: "Tyler, The Creator",
    traits: { romance: 3, softness: 2, warmth: 1 },
    scenarios: ["chill", "sad", "drive"],
    chips: [
      { emoji: "💘", label: "Dreamy" },
      { emoji: "🪶", label: "Soft" },
    ],
  },
  {
    title: "Let It Happen",
    artist: "Tame Impala",
    traits: { chaos: 2, cinematic: 2, energy: 2, tempo: 2, focus: 1 },
    scenarios: ["drive", "focus", "party"],
    chips: [
      { emoji: "🌪️", label: "Spiraling" },
      { emoji: "🎬", label: "Epic build" },
    ],
  },
  {
    title: "Circles",
    artist: "Post Malone",
    traits: { softness: 2, warmth: 1, romance: 1, darkness: 1 },
    scenarios: ["chill", "sad", "drive"],
    chips: [
      { emoji: "🪶", label: "Easy" },
      { emoji: "💔", label: "Bittersweet" },
    ],
  },
  {
    title: "Physical",
    artist: "Dua Lipa",
    traits: { energy: 3, tempo: 3, confidence: 2 },
    scenarios: ["party", "gym"],
    chips: [
      { emoji: "⚡", label: "Cardio" },
      { emoji: "🕺", label: "Movement" },
    ],
  },
  {
    title: "Delilah (pull me out of this)",
    artist: "Fred again..",
    traits: { energy: 2, tempo: 2, romance: 1, chaos: 1, focus: 1 },
    scenarios: ["party", "focus", "drive"],
    chips: [
      { emoji: "🕺", label: "Late-night dance" },
      { emoji: "💘", label: "Emotional" },
    ],
  },
  {
    title: "Redbone",
    artist: "Childish Gambino",
    traits: { warmth: 2, romance: 2, softness: 2, darkness: 1 },
    scenarios: ["chill", "sad"],
    chips: [
      { emoji: "🌅", label: "Groove" },
      { emoji: "💘", label: "Smooth" },
    ],
  },
  {
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    traits: { darkness: 2, romance: 2, confidence: 1, cinematic: 1 },
    scenarios: ["drive", "sad", "gym"],
    chips: [
      { emoji: "🖤", label: "Brooding" },
      { emoji: "💘", label: "Tension" },
    ],
  },
  {
    title: "Glimpse of Us",
    artist: "Joji",
    traits: { romance: 3, softness: 3, darkness: 1 },
    scenarios: ["sad", "chill"],
    chips: [
      { emoji: "💔", label: "Heartbreak" },
      { emoji: "🪶", label: "Fragile" },
    ],
  },
  {
    title: "Midnight City",
    artist: "M83",
    traits: { cinematic: 3, energy: 2, tempo: 2, warmth: 1 },
    scenarios: ["drive", "party", "focus"],
    chips: [
      { emoji: "🌃", label: "City lights" },
      { emoji: "🎬", label: "Movie ending" },
    ],
  },
  {
    title: "Instant Crush",
    artist: "Daft Punk",
    traits: { romance: 2, cinematic: 1, softness: 1, tempo: 1, warmth: 1 },
    scenarios: ["drive", "chill", "sad"],
    chips: [
      { emoji: "💘", label: "Wistful" },
      { emoji: "🌃", label: "Synth glow" },
    ],
  },
  {
    title: "No Role Modelz",
    artist: "J. Cole",
    traits: { confidence: 2, warmth: 1, focus: 1, tempo: 1 },
    scenarios: ["chill", "drive", "party"],
    chips: [
      { emoji: "👑", label: "Self-made" },
      { emoji: "🌅", label: "Laid-back" },
    ],
  },
  {
    title: "Needed Me",
    artist: "Rihanna",
    traits: { confidence: 3, darkness: 2, softness: 1 },
    scenarios: ["party", "drive", "gym"],
    chips: [
      { emoji: "👑", label: "Savage" },
      { emoji: "🖤", label: "Cold" },
    ],
  },
  {
    title: "Feel So Close",
    artist: "Calvin Harris",
    traits: { energy: 2, warmth: 2, tempo: 2, romance: 1 },
    scenarios: ["party", "gym", "drive"],
    chips: [
      { emoji: "⚡", label: "Festival" },
      { emoji: "🌅", label: "Feel-good" },
    ],
  },
  {
    title: "Awake",
    artist: "Tycho",
    traits: { focus: 3, warmth: 2, softness: 2 },
    scenarios: ["focus", "chill"],
    chips: [
      { emoji: "🧠", label: "Instrumental" },
      { emoji: "🌅", label: "Glow" },
    ],
  },
  {
    title: "Kerala",
    artist: "Bonobo",
    traits: { focus: 3, tempo: 1, softness: 1, cinematic: 1 },
    scenarios: ["focus", "chill"],
    chips: [
      { emoji: "🧠", label: "Flow state" },
      { emoji: "🥁", label: "Pulse" },
    ],
  },
  {
    title: "Motion Sickness",
    artist: "Phoebe Bridgers",
    traits: { romance: 2, softness: 2, darkness: 1 },
    scenarios: ["sad", "chill"],
    chips: [
      { emoji: "💔", label: "Bittersweet" },
      { emoji: "🌧️", label: "Indie ache" },
    ],
  },
  {
    title: "Holocene",
    artist: "Bon Iver",
    traits: { softness: 3, cinematic: 2, warmth: 1, romance: 1 },
    scenarios: ["sad", "chill", "focus"],
    chips: [
      { emoji: "🌧️", label: "Quiet awe" },
      { emoji: "🎬", label: "Wide open" },
    ],
  },
  {
    title: "Latch",
    artist: "Disclosure",
    traits: { energy: 2, romance: 2, tempo: 2, warmth: 1 },
    scenarios: ["party", "gym"],
    chips: [
      { emoji: "🕺", label: "Dance" },
      { emoji: "💘", label: "Euphoric" },
    ],
  },
  {
    title: "Till I Collapse",
    artist: "Eminem",
    traits: { aggression: 3, energy: 3, confidence: 2 },
    scenarios: ["gym"],
    chips: [
      { emoji: "🥊", label: "Last rep" },
      { emoji: "⚡", label: "Relentless" },
    ],
  },
  {
    title: "Day 'N' Nite",
    artist: "Kid Cudi",
    traits: { darkness: 2, focus: 1, softness: 1, cinematic: 1 },
    scenarios: ["drive", "sad", "focus"],
    chips: [
      { emoji: "🌙", label: "Night loner" },
      { emoji: "🖤", label: "Moody" },
    ],
  },
  {
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    traits: { cinematic: 2, romance: 2, darkness: 2, warmth: 1 },
    scenarios: ["sad", "drive", "chill"],
    chips: [
      { emoji: "🎬", label: "Tragic glam" },
      { emoji: "💔", label: "Summer ache" },
    ],
  },
  {
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    traits: { energy: 3, tempo: 3, confidence: 2, warmth: 1 },
    scenarios: ["party"],
    chips: [
      { emoji: "🕺", label: "Instant party" },
      { emoji: "👑", label: "Swagger" },
    ],
  },
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
