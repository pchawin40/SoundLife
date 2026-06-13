import type { CardType, Trait, TraitScores, VibeCardData } from "./types";
import { CARD_VISUALS, type CardVisualDefinition } from "./cardVisualMap";

const PHOTO_OVERLAY =
  "linear-gradient(180deg, rgba(6, 8, 12, 0.04) 0%, rgba(6, 8, 12, 0.2) 54%, rgba(6, 8, 12, 0.72) 100%)";
const SOFT_PHOTO_OVERLAY =
  "linear-gradient(180deg, rgba(6, 8, 12, 0.00) 0%, rgba(6, 8, 12, 0.14) 50%, rgba(6, 8, 12, 0.64) 100%)";

const GRAIN_TEXTURE =
  "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.03) 0deg 2deg, transparent 2deg 4deg)";

export interface CardVisual {
  accent: string;
  background: string;
  eyebrow: string;
  imageUrl?: string;
  imageAlt?: string;
  visualPrompt?: string;
  visualTheme?: string;
  legacyImageUrl?: string;
  imagePosition?: string;
  overlay: string;
  pattern?: string;
  tags: string[];
  texture?: string;
}

export type CardVisualInput = Pick<
  VibeCardData,
  | "id"
  | "title"
  | "subtitle"
  | "cardType"
  | "gradient"
  | "traits"
  | "imageUrl"
  | "imageAlt"
  | "visualPrompt"
  | "visualTheme"
  | "boostLanguages"
  | "boostRegions"
>;

interface ThemeSpec {
  accent: string;
  background: string;
  eyebrow: string;
  imagePosition?: string;
  overlay: string;
  pattern?: string;
  tags: string[];
  texture?: string;
}

const THEME_VISUALS: Record<string, ThemeSpec> = {
  "instrumental-focus": {
    accent: "#0F766E",
    background:
      "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.22), transparent 28%), " +
      "linear-gradient(145deg, #0f172a 0%, #134e4a 42%, #115e59 100%)",
    eyebrow: "Pure sound",
    overlay: SOFT_PHOTO_OVERLAY,
    pattern:
      "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), " +
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
    tags: ["Focus", "Instrumental", "Calm"],
    texture: GRAIN_TEXTURE,
  },
  "night-drive": {
    accent: "#A855F7",
    background:
      "radial-gradient(circle at 72% 24%, rgba(236,72,153,0.28), transparent 30%), " +
      "linear-gradient(145deg, #020617 0%, #312e81 48%, #831843 100%)",
    eyebrow: "After dark",
    imagePosition: "center center",
    overlay: PHOTO_OVERLAY,
    tags: ["Night drive", "Neon", "Cinematic"],
    texture: GRAIN_TEXTURE,
  },
  "rainy-cafe": {
    accent: "#D97706",
    background:
      "radial-gradient(circle at 14% 18%, rgba(251,191,36,0.18), transparent 28%), " +
      "linear-gradient(145deg, #1f2937 0%, #92400e 55%, #dbeafe 100%)",
    eyebrow: "Cafe scene",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Cafe", "Soft", "Focus"],
    texture: GRAIN_TEXTURE,
  },
  "beach-sunset": {
    accent: "#0D9488",
    background:
      "radial-gradient(circle at 20% 16%, rgba(255,255,255,0.28), transparent 30%), " +
      "linear-gradient(145deg, #f97316 0%, #facc15 48%, #0d9488 100%)",
    eyebrow: "Golden hour",
    imagePosition: "center 44%",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Beach", "Sunset", "Warm"],
    texture: GRAIN_TEXTURE,
  },
  "gym-power": {
    accent: "#DC2626",
    background:
      "radial-gradient(circle at 78% 24%, rgba(239,68,68,0.3), transparent 28%), " +
      "linear-gradient(145deg, #111111 0%, #450a0a 54%, #dc2626 100%)",
    eyebrow: "Power mode",
    imagePosition: "center 35%",
    overlay: PHOTO_OVERLAY,
    tags: ["Gym", "Intensity", "Focus"],
    texture: GRAIN_TEXTURE,
  },
  "dark-club": {
    accent: "#22D3EE",
    background:
      "radial-gradient(circle at 72% 20%, rgba(34,211,238,0.24), transparent 30%), " +
      "linear-gradient(145deg, #09090b 0%, #581c87 52%, #0e7490 100%)",
    eyebrow: "Nightlife",
    overlay: PHOTO_OVERLAY,
    tags: ["Club", "Bass", "Night"],
    texture: GRAIN_TEXTURE,
  },
  "party-pregame": {
    accent: "#F97316",
    background:
      "radial-gradient(circle at 24% 18%, rgba(255,255,255,0.24), transparent 28%), " +
      "linear-gradient(145deg, #7c2d12 0%, #f97316 54%, #14b8a6 100%)",
    eyebrow: "Pregame",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Friends", "Warm", "Hype"],
    texture: GRAIN_TEXTURE,
  },
  "rage-cleaning": {
    accent: "#0D9488",
    background:
      "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.3), transparent 28%), " +
      "linear-gradient(145deg, #f8fafc 0%, #14b8a6 52%, #f97316 100%)",
    eyebrow: "Clean reset",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Motion", "Reset", "Energy"],
    texture: GRAIN_TEXTURE,
  },
  heartbreak: {
    accent: "#DB2777",
    background:
      "radial-gradient(circle at 24% 20%, rgba(255,255,255,0.16), transparent 28%), " +
      "linear-gradient(145deg, #312e81 0%, #831843 52%, #1e1b4b 100%)",
    eyebrow: "Heartbreak",
    overlay: PHOTO_OVERLAY,
    tags: ["Sad", "Cinematic", "Late night"],
    texture: GRAIN_TEXTURE,
  },
  afrobeats: {
    accent: "#F59E0B",
    background:
      "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.32), transparent 30%), " +
      "linear-gradient(145deg, #fbbf24 0%, #fb7185 52%, #0f766e 100%)",
    eyebrow: "Sunlit",
    imagePosition: "center 48%",
    overlay: PHOTO_OVERLAY,
    tags: ["Afrobeats", "Sunlit", "Global"],
    texture: GRAIN_TEXTURE,
  },
  "global-street": {
    accent: "#F59E0B",
    background:
      "radial-gradient(circle at 78% 18%, rgba(255,255,255,0.22), transparent 28%), " +
      "linear-gradient(145deg, #0f172a 0%, #0f766e 52%, #f97316 100%)",
    eyebrow: "Global walk",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Global", "Street", "Voice"],
    texture: GRAIN_TEXTURE,
  },
  "mystery-neon": {
    accent: "#A855F7",
    background:
      "radial-gradient(circle at 70% 22%, rgba(34,211,238,0.22), transparent 28%), " +
      "linear-gradient(145deg, #0f172a 0%, #312e81 54%, #0e7490 100%)",
    eyebrow: "Mystery mood",
    overlay: PHOTO_OVERLAY,
    tags: ["Mystery", "Neon", "Moody"],
    texture: GRAIN_TEXTURE,
  },
  "acoustic-morning": {
    accent: "#CA8A04",
    background:
      "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.34), transparent 28%), " +
      "linear-gradient(145deg, #fef9c3 0%, #fde68a 48%, #f59e0b 100%)",
    eyebrow: "Morning light",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Acoustic", "Warm", "Soft"],
    texture: GRAIN_TEXTURE,
  },
  "genre-pulse": {
    accent: "#059669",
    background:
      "radial-gradient(circle at 72% 18%, rgba(255,255,255,0.24), transparent 26%), " +
      "linear-gradient(145deg, #064e3b 0%, #10b981 48%, #facc15 100%)",
    eyebrow: "Genre scene",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Genre", "Taste", "Pulse"],
    texture: GRAIN_TEXTURE,
  },
  "boundary-filter": {
    accent: "#DC2626",
    background:
      "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.28), transparent 26%), " +
      "linear-gradient(145deg, #7f1d1d 0%, #ef4444 52%, #fef3c7 100%)",
    eyebrow: "Boundary",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Filter", "Boundaries", "Taste"],
    texture: GRAIN_TEXTURE,
  },
  "main-character": {
    accent: "#E11D48",
    background:
      "radial-gradient(circle at 24% 20%, rgba(255,255,255,0.26), transparent 28%), " +
      "linear-gradient(145deg, #881337 0%, #fb7185 48%, #f59e0b 100%)",
    eyebrow: "Main character",
    overlay: PHOTO_OVERLAY,
    tags: ["Drama", "Motion", "Cinematic"],
    texture: GRAIN_TEXTURE,
  },
  "soft-chaos": {
    accent: "#8B5CF6",
    background:
      "radial-gradient(circle at 76% 18%, rgba(255,255,255,0.22), transparent 28%), " +
      "linear-gradient(145deg, #312e81 0%, #c4b5fd 48%, #f472b6 100%)",
    eyebrow: "Soft chaos",
    overlay: SOFT_PHOTO_OVERLAY,
    tags: ["Soft", "Chaos", "Healing"],
    texture: GRAIN_TEXTURE,
  },
  "life-scene": {
    accent: "#374151",
    background:
      "radial-gradient(circle at 74% 18%, rgba(255,255,255,0.3), transparent 26%), " +
      "linear-gradient(145deg, #111827 0%, #64748b 50%, #f8fafc 100%)",
    eyebrow: "Life scene",
    overlay: PHOTO_OVERLAY,
    tags: ["Taste", "Signal", "Mood"],
    texture: GRAIN_TEXTURE,
  },
};

const TYPE_THEME: Record<CardType, string> = {
  lifestyle: "life-scene",
  mood: "mystery-neon",
  sound: "instrumental-focus",
  genre: "genre-pulse",
  antiGenre: "boundary-filter",
  language: "global-street",
  region: "night-drive",
};

const TRAIT_TAGS: Record<Trait, string> = {
  aggression: "Intensity",
  chaos: "Chaos",
  cinematic: "Cinematic",
  confidence: "Confidence",
  darkness: "After dark",
  energy: "Energy",
  focus: "Focus",
  romance: "Romance",
  softness: "Soft",
  tempo: "Tempo",
  warmth: "Warm",
};

function dominantTraitTheme(traits?: TraitScores): string | null {
  const top = Object.entries(traits ?? {}).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0]?.[0];
  if (!top) return null;
  if (top === "focus") return "instrumental-focus";
  if (top === "darkness" || top === "cinematic") return "night-drive";
  if (top === "energy" || top === "aggression") return "gym-power";
  if (top === "softness" || top === "warmth") return "rainy-cafe";
  if (top === "romance") return "heartbreak";
  if (top === "chaos") return "soft-chaos";
  return null;
}

function mergeDefinition(
  card: CardVisualInput,
  definition?: CardVisualDefinition
): CardVisualDefinition | undefined {
  if (!definition && !card.imageUrl && !card.visualTheme) return undefined;
  return {
    imageUrl: card.imageUrl ?? definition?.imageUrl ?? "",
    imageAlt: card.imageAlt ?? definition?.imageAlt ?? `${card.title}: ${card.subtitle}`,
    visualTheme: card.visualTheme ?? definition?.visualTheme ?? TYPE_THEME[card.cardType ?? "lifestyle"],
    visualPrompt: card.visualPrompt ?? definition?.visualPrompt,
    legacyImageUrl: definition?.legacyImageUrl,
  };
}

function buildVisual(card: CardVisualInput, definition?: CardVisualDefinition): CardVisual {
  const themeKey =
    definition?.visualTheme ??
    card.visualTheme ??
    dominantTraitTheme(card.traits) ??
    TYPE_THEME[card.cardType ?? "lifestyle"];
  const theme = THEME_VISUALS[themeKey] ?? THEME_VISUALS["life-scene"];
  const background = card.gradient
    ? `radial-gradient(circle at 20% 18%, rgba(255,255,255,0.28), transparent 28%), ${card.gradient}`
    : theme.background;

  return {
    accent: theme.accent,
    background,
    eyebrow: theme.eyebrow,
    imageUrl: definition?.imageUrl || card.imageUrl || undefined,
    imageAlt: definition?.imageAlt ?? card.imageAlt,
    visualPrompt: definition?.visualPrompt ?? card.visualPrompt,
    visualTheme: themeKey,
    legacyImageUrl: definition?.legacyImageUrl,
    imagePosition: theme.imagePosition,
    overlay: theme.overlay,
    pattern: theme.pattern,
    texture: theme.texture,
    tags: theme.tags,
  };
}

export function getCardVisual(card: CardVisualInput): CardVisual {
  const definition = mergeDefinition(card, CARD_VISUALS[card.id]);
  if (definition) {
    return buildVisual(card, definition);
  }

  const title = card.title.toLowerCase();
  if (title.includes("afrobeats") || title.includes("lagos")) {
    return buildVisual(card, { ...CARD_VISUALS["afrobeats-sunshine"], visualTheme: "afrobeats" });
  }
  if (title.includes("tokyo") || title.includes("night drive") || title.includes("highway")) {
    return buildVisual(card, { ...CARD_VISUALS["tokyo-neon-walk"], visualTheme: "night-drive" });
  }
  if (title.includes("no lyrics") || title.includes("instrumental") || title.includes("deep work")) {
    return buildVisual(card, { ...CARD_VISUALS["no-lyrics"], visualTheme: "instrumental-focus" });
  }
  if (title.includes("gym") || title.includes("boxing") || title.includes("villain")) {
    return buildVisual(card, { ...CARD_VISUALS["gym-villain"], visualTheme: "gym-power" });
  }
  if (title.includes("coffee") || title.includes("cafe") || title.includes("rainy")) {
    return buildVisual(card, { ...CARD_VISUALS["coffee-shop"], visualTheme: "rainy-cafe" });
  }
  if (title.includes("beach") || title.includes("sunset")) {
    return buildVisual(card, { ...CARD_VISUALS["beach-sunset"], visualTheme: "beach-sunset" });
  }
  if (title.includes("club") || title.includes("dance floor") || title.includes("bass drop")) {
    return buildVisual(card, { ...CARD_VISUALS["dark-club"], visualTheme: "dark-club" });
  }

  return buildVisual(card);
}

export function resolveVibeTags(input: CardVisualInput, visual = getCardVisual(input)): string[] {
  const traitTags = Object.entries(input.traits ?? {})
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .map(([trait]) => TRAIT_TAGS[trait as Trait])
    .filter(Boolean);

  return [...new Set([...visual.tags, ...traitTags])].slice(0, 3);
}

export { CARD_VISUALS };
