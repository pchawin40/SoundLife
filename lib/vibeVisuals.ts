import type { CardType, Trait, TraitScores } from "./types";

export interface VibeVisualInput {
  id?: string;
  title: string;
  cardType?: CardType;
  gradient?: string;
  traits?: TraitScores;
}

export interface VibeVisual {
  accent: string;
  background: string;
  eyebrow: string;
  imagePosition?: string;
  imageUrl?: string;
  overlay: string;
  tags: string[];
}

const PHOTO_OVERLAY =
  "linear-gradient(180deg, rgba(6, 8, 12, 0.02) 0%, rgba(6, 8, 12, 0.18) 54%, rgba(6, 8, 12, 0.7) 100%)";

const PHOTO_VISUALS: Record<string, VibeVisual> = {
  "afrobeats-sunshine": {
    accent: "#F59E0B",
    background: "linear-gradient(145deg, #fbbf24 0%, #fb7185 52%, #0f766e 100%)",
    eyebrow: "Sunlit",
    imagePosition: "center 48%",
    imageUrl: "/vibes/afrobeats-sunshine.png",
    overlay:
      "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.35), transparent 30%), " +
      PHOTO_OVERLAY,
    tags: ["Afrobeats", "Sunlit", "Dance"],
  },
  "late-night-highway": {
    accent: "#7C3AED",
    background: "linear-gradient(145deg, #111827 0%, #312e81 46%, #db2777 100%)",
    eyebrow: "After dark",
    imagePosition: "center center",
    imageUrl: "/vibes/tokyo-night-drive.png",
    overlay:
      "radial-gradient(circle at 72% 28%, rgba(236,72,153,0.34), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Night drive", "Neon", "Cinematic"],
  },
  "tokyo-neon-walk": {
    accent: "#A855F7",
    background: "linear-gradient(145deg, #111827 0%, #312e81 46%, #db2777 100%)",
    eyebrow: "Neon city",
    imagePosition: "center center",
    imageUrl: "/vibes/tokyo-night-drive.png",
    overlay:
      "radial-gradient(circle at 70% 28%, rgba(34,211,238,0.32), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Tokyo", "Night", "Neon"],
  },
  "tokyo-night-drive": {
    accent: "#A855F7",
    background: "linear-gradient(145deg, #111827 0%, #312e81 46%, #db2777 100%)",
    eyebrow: "Neon city",
    imagePosition: "center center",
    imageUrl: "/vibes/tokyo-night-drive.png",
    overlay:
      "radial-gradient(circle at 70% 28%, rgba(34,211,238,0.32), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Tokyo", "Night", "Drive"],
  },
  "gym-villain": {
    accent: "#DC2626",
    background: "linear-gradient(145deg, #111111 0%, #450a0a 54%, #dc2626 100%)",
    eyebrow: "Villain arc",
    imagePosition: "center 35%",
    imageUrl: "/vibes/gym-villain-arc.png",
    overlay:
      "radial-gradient(circle at 78% 24%, rgba(239,68,68,0.36), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Gym", "Power", "Focus"],
  },
  boxing: {
    accent: "#DC2626",
    background: "linear-gradient(145deg, #111111 0%, #450a0a 54%, #dc2626 100%)",
    eyebrow: "Fight mode",
    imagePosition: "center 35%",
    imageUrl: "/vibes/gym-villain-arc.png",
    overlay:
      "radial-gradient(circle at 78% 24%, rgba(239,68,68,0.36), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Training", "Power", "Focus"],
  },
  "gym-villain-arc": {
    accent: "#DC2626",
    background: "linear-gradient(145deg, #111111 0%, #450a0a 54%, #dc2626 100%)",
    eyebrow: "Villain arc",
    imagePosition: "center 35%",
    imageUrl: "/vibes/gym-villain-arc.png",
    overlay:
      "radial-gradient(circle at 78% 24%, rgba(239,68,68,0.36), transparent 28%), " +
      PHOTO_OVERLAY,
    tags: ["Gym", "Power", "Focus"],
  },
  "beach-sunset": {
    accent: "#0D9488",
    background: "linear-gradient(145deg, #f97316 0%, #facc15 48%, #0d9488 100%)",
    eyebrow: "Golden hour",
    imagePosition: "center 44%",
    imageUrl: "/vibes/soft-beach-sunset.png",
    overlay:
      "radial-gradient(circle at 20% 16%, rgba(255,255,255,0.34), transparent 30%), " +
      PHOTO_OVERLAY,
    tags: ["Beach", "Sunset", "Soft"],
  },
  "soft-beach-sunset": {
    accent: "#0D9488",
    background: "linear-gradient(145deg, #f97316 0%, #facc15 48%, #0d9488 100%)",
    eyebrow: "Golden hour",
    imagePosition: "center 44%",
    imageUrl: "/vibes/soft-beach-sunset.png",
    overlay:
      "radial-gradient(circle at 20% 16%, rgba(255,255,255,0.34), transparent 30%), " +
      PHOTO_OVERLAY,
    tags: ["Beach", "Sunset", "Soft"],
  },
  "lagos-everywhere": {
    accent: "#F59E0B",
    background: "linear-gradient(145deg, #fbbf24 0%, #fb7185 52%, #0f766e 100%)",
    eyebrow: "Global heat",
    imagePosition: "center 48%",
    imageUrl: "/vibes/afrobeats-sunshine.png",
    overlay:
      "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.35), transparent 30%), " +
      PHOTO_OVERLAY,
    tags: ["Lagos", "Afrobeats", "Sunlit"],
  },
};

const TYPE_VISUALS: Record<CardType | "default", VibeVisual> = {
  lifestyle: {
    accent: "#0D9488",
    background:
      "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 26%), linear-gradient(145deg, #0f766e 0%, #f59e0b 58%, #fb7185 100%)",
    eyebrow: "Life scene",
    overlay: PHOTO_OVERLAY,
    tags: ["Lifestyle", "Human", "Mood"],
  },
  mood: {
    accent: "#7C3AED",
    background:
      "radial-gradient(circle at 78% 20%, rgba(255,255,255,0.24), transparent 26%), linear-gradient(145deg, #111827 0%, #7c3aed 48%, #f97316 100%)",
    eyebrow: "Moodboard",
    overlay: PHOTO_OVERLAY,
    tags: ["Mood", "Cinematic", "Personal"],
  },
  sound: {
    accent: "#2563EB",
    background:
      "radial-gradient(circle at 26% 18%, rgba(255,255,255,0.34), transparent 26%), linear-gradient(145deg, #0f172a 0%, #2563eb 48%, #22c55e 100%)",
    eyebrow: "Texture",
    overlay: PHOTO_OVERLAY,
    tags: ["Sound", "Texture", "Signal"],
  },
  genre: {
    accent: "#059669",
    background:
      "radial-gradient(circle at 72% 18%, rgba(255,255,255,0.28), transparent 26%), linear-gradient(145deg, #064e3b 0%, #10b981 48%, #facc15 100%)",
    eyebrow: "Genre lane",
    overlay: PHOTO_OVERLAY,
    tags: ["Genre", "Taste", "Pulse"],
  },
  antiGenre: {
    accent: "#DC2626",
    background:
      "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.34), transparent 26%), linear-gradient(145deg, #7f1d1d 0%, #ef4444 52%, #fef3c7 100%)",
    eyebrow: "Hard pass",
    overlay: PHOTO_OVERLAY,
    tags: ["Filter", "Boundaries", "Taste"],
  },
  language: {
    accent: "#0284C7",
    background:
      "radial-gradient(circle at 78% 18%, rgba(255,255,255,0.32), transparent 26%), linear-gradient(145deg, #0c4a6e 0%, #38bdf8 52%, #f0abfc 100%)",
    eyebrow: "Language",
    overlay: PHOTO_OVERLAY,
    tags: ["Global", "Voice", "Taste"],
  },
  region: {
    accent: "#DB2777",
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3), transparent 26%), linear-gradient(145deg, #831843 0%, #db2777 48%, #f59e0b 100%)",
    eyebrow: "Scene",
    overlay: PHOTO_OVERLAY,
    tags: ["Place", "Scene", "Global"],
  },
  default: {
    accent: "#374151",
    background:
      "radial-gradient(circle at 74% 18%, rgba(255,255,255,0.34), transparent 26%), linear-gradient(145deg, #111827 0%, #64748b 50%, #f8fafc 100%)",
    eyebrow: "Vibe",
    overlay: PHOTO_OVERLAY,
    tags: ["Taste", "Signal", "Mood"],
  },
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

export function resolveVibeVisual(input: VibeVisualInput): VibeVisual {
  const idVisual = input.id ? PHOTO_VISUALS[input.id] : undefined;
  if (idVisual) return idVisual;

  const title = input.title.toLowerCase();
  if (title.includes("afrobeats") || title.includes("lagos")) return PHOTO_VISUALS["afrobeats-sunshine"];
  if (title.includes("tokyo") || title.includes("night drive")) return PHOTO_VISUALS["tokyo-night-drive"];
  if (title.includes("gym villain") || title.includes("boxing")) return PHOTO_VISUALS["gym-villain"];
  if (title.includes("beach") || title.includes("sunset")) return PHOTO_VISUALS["beach-sunset"];

  const fallback = TYPE_VISUALS[input.cardType ?? "default"];
  return {
    ...fallback,
    background: input.gradient
      ? `radial-gradient(circle at 20% 18%, rgba(255,255,255,0.34), transparent 28%), ${input.gradient}`
      : fallback.background,
  };
}

export function resolveVibeTags(input: VibeVisualInput, visual = resolveVibeVisual(input)): string[] {
  const traitTags = Object.entries(input.traits ?? {})
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .map(([trait]) => TRAIT_TAGS[trait as Trait])
    .filter(Boolean);

  return [...new Set([...visual.tags, ...traitTags])].slice(0, 3);
}
