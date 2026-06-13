#!/usr/bin/env tsx
/**
 * CI/dev-only card image generator. Never imported by the Next.js app.
 * Requires OPENAI_API_KEY in the environment or .env.local.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { CARD_VISUALS } from "../lib/cardVisualMap";
import { FALLBACK_VIBE_CARDS } from "../lib/catalog.fallback";

const OUT_DIR = join(process.cwd(), "public", "images", "cards");

export type ImageStyle =
  | "editorial-photo"
  | "realistic"
  | "editorial"
  | "elephant"
  | "mascot"
  | "cartoon";

const EDITORIAL_PHOTO_BASE_PROMPT =
  "realistic editorial lifestyle photograph for a music discovery app, candid documentary feel, atmospheric scene, natural imperfect lighting, subtle film grain, playlist-cover composition, no text, no logos, no watermark, no celebrity, no album art, no close-up face, no distorted hands, no extra fingers, not overly polished, not glossy AI stock photo";

const ELEPHANT_STYLE_BASE_PROMPT =
  "colorful cartoon vector-style scene for a music discovery app, cute original elephant mascot wearing oversized headphones, head-and-upper-body composition, legs hidden behind foreground object when possible, expressive simple face, clean bold outlines, bright tasteful colors, polished app illustration, simple but immersive scene background, no text, no logos, no watermark, no extra limbs, no extra legs, not a panda, not an existing character, not copyrighted";

const STYLE_SUFFIXES: Record<ImageStyle, string> = {
  "editorial-photo": EDITORIAL_PHOTO_BASE_PROMPT,
  realistic: EDITORIAL_PHOTO_BASE_PROMPT,
  editorial: EDITORIAL_PHOTO_BASE_PROMPT,
  elephant: ELEPHANT_STYLE_BASE_PROMPT,
  mascot: ELEPHANT_STYLE_BASE_PROMPT,
  cartoon:
    "stylized character, simple bare background, bright color palette, playful music app card art, expressive pose, soft lighting, minimal details, no text, no logos, no watermark, no realistic face, no distorted hands, no extra fingers",
};

const CARTOON_SIMPLICITY =
  "Single stylized character, one clear pose, simple bare background, limited props, no crowded scene, ";

const EDITORIAL_PHOTO_SCENE_PROMPTS: Record<string, string> = {
  "instrumental-focus":
    "quiet bedroom desk at night with over-ear headphones beside a laptop and notebook, soft blue lamp light, calm focus mood, no visible face, no hands",
  "night-drive":
    "view from inside a car at night, neon city lights reflected on wet windshield, empty passenger seat, cinematic blue and pink glow, no visible face",
  "rainy-cafe":
    "cozy cafe window with rain outside, headphones and coffee on table, blurred city lights beyond glass, soft gray-blue mood, no visible face",
  "beach-sunset":
    "two people sitting from behind on a beach at sunset, headphones and blanket nearby, warm orange sky, relaxed mood, no visible faces",
  "gym-power":
    "moody gym corner with hoodie on bench, dumbbells, dramatic side lighting, intense workout atmosphere, no visible face, no hands",
  "dark-club":
    "crowded club silhouettes under purple and blue lights, DJ booth blurred in background, motion blur, no identifiable faces",
  "party-pregame":
    "warm kitchen counter before a night out, cups and phone on counter, friends blurred from behind, candid pregame energy, no close-up faces",
  "rage-cleaning":
    "bright apartment after cleaning, laundry basket and spray bottle in foreground, sunlight through window, reset energy, no visible face",
  heartbreak:
    "dim bedroom by a rainy window at night, rumpled blanket and phone glow, lonely cinematic mood, no visible face, no hands",
  afrobeats:
    "sunny street scene at golden hour, friends dancing in soft motion blur from behind, warm orange light, joyful energy, no close-up faces",
  "global-street":
    "street scene at dusk with headphones on a bench, blurred storefront lights, passing figures from behind, global city energy, no close-up faces",
  "mystery-neon":
    "neon-lit street corner at night, rain reflections, cropped figure from behind in the distance, atmospheric mystery mood, no visible face",
  "acoustic-morning":
    "sunlit bedroom corner with acoustic guitar, coffee mug, headphones, and rumpled blanket, warm morning light, no people",
  "genre-pulse":
    "small venue stage after soundcheck, microphone stand out of focus, speaker lights and cables, atmospheric music scene, no performer faces",
  "boundary-filter":
    "headphones on a closed laptop near a doorway, clean minimal room, decisive quiet mood, no visible face, no hands",
  "main-character":
    "city sidewalk at golden hour, cropped back-facing figure in motion blur, streetlights and shop windows, film-still mood, no close-up face",
  "soft-chaos":
    "messy bedroom desk with headphones, calendar, coffee, and soft pastel light, emotionally busy mood, no people",
  "life-scene":
    "atmospheric everyday music listening scene with headphones or speaker in the foreground, candid environment, no close-up face",
};

const ELEPHANT_SCENE_PROMPTS: Record<string, string> = {
  "instrumental-focus":
    "behind a laptop or tiny desk by a window, quiet bedroom studio scene, soft blue night lighting, notebook and small lamp, calm focus mood, legs hidden by desk",
  "night-drive":
    "driving a tiny car through a simplified neon city at night, legs hidden by car dashboard, blue and pink window glow, road lights, cinematic but cute mood",
  "rainy-cafe":
    "behind a cafe table beside a rainy window, warm mug in foreground, soft gray-blue background, cozy calm mood, legs hidden by table",
  "beach-sunset":
    "behind a beach blanket at sunset, simple ocean waves, orange sky, calm relaxed mood, legs hidden by blanket",
  "gym-power":
    "wearing a tiny hoodie behind a gym bag or bench in a simplified gym scene, small dumbbells, dramatic red lighting, playful confident villain energy, legs hidden by equipment",
  "dark-club":
    "behind a DJ booth under simple club lights, purple and blue beams, tiny speakers, fun nightlife scene, legs hidden by booth",
  "party-pregame":
    "behind a tiny kitchen counter in a pregame scene, warm counter lights, tiny cup, playful party energy, legs hidden by counter",
  "rage-cleaning":
    "peeking from behind a laundry basket in a bright room scene, sparkle shapes, one tiny spray bottle prop, energetic reset mood, legs hidden by basket",
  heartbreak:
    "behind a pillow or bed edge in a cozy bedroom scene by a rainy window at night, soft indigo lighting, tiny phone glow, gentle heartbreak mood, legs hidden",
  afrobeats:
    "upper body dancing behind a sunny street foreground shape, warm orange-yellow background, simple palm or tree shapes, joyful movement, legs cropped or hidden",
  "global-street":
    "peeking from behind a city signpost or market stall in a simplified city street scene, teal and gold color accents, curious global music mood, legs hidden",
  "mystery-neon":
    "peeking from behind a neon foreground shape in a simplified city corner, glowing signs without text, magenta and navy lighting, thoughtful mystery mood, legs hidden",
  "acoustic-morning":
    "behind a tiny acoustic guitar and coffee table in a cozy morning room, sunlit window, coffee mug, small plant, warm cream background, legs hidden or cropped",
  "genre-pulse":
    "behind a tiny stage monitor or speaker in a concert stage scene, soft spotlights, simple speaker shapes, confident music-genre energy, legs hidden",
  "boundary-filter":
    "peeking from behind a clean divider shape while making a gentle stop gesture, clear taste-boundary mood, legs hidden",
  "main-character":
    "upper body framed behind a foreground crosswalk rail in a simplified city sidewalk scene, tiny skyline, dramatic confident mood, legs hidden",
  "soft-chaos":
    "behind a pillow or desk clutter in a cozy bedroom scene with soft pastel objects, tiny calendar, playful messy energy, legs hidden",
  "life-scene":
    "head and upper body inside a tiny everyday illustrated scene, simplified room or street shapes, relaxed expressive music mood, legs hidden by foreground object",
};

type ElephantSceneCategory =
  | "city-neon-night-drive"
  | "sunny-street"
  | "forest-nature"
  | "beach-sunset"
  | "gym-workout"
  | "cafe-rainy-cozy"
  | "club-party"
  | "desk-focus-no-lyrics"
  | "stage-concert"
  | "bedroom-sad-heartbreak"
  | "road-trip-car";

const ELEPHANT_SCENE_CATEGORY_PROMPTS: Record<ElephantSceneCategory, string> = {
  "city-neon-night-drive":
    "scene/background: simplified city street or neon night road, skyline or window lights, car dashboard or foreground rail hiding legs, 2-4 background elements max",
  "sunny-street":
    "scene/background: sunny street scene, warm orange-yellow color, simple palm or tree shapes, foreground wall or market stall hiding legs, 2-4 background elements max",
  "forest-nature":
    "scene/background: simple forest path, green tree shapes, sunlight beams, tree or leaf foreground hiding legs, 2-4 background elements max",
  "beach-sunset":
    "scene/background: simple beach sunset, orange sky, ocean waves, beach blanket or float hiding legs, 2-4 background elements max",
  "gym-workout":
    "scene/background: simplified gym, small dumbbells, bench or gym bag hiding legs, dramatic red lighting, 2-4 background elements max",
  "cafe-rainy-cozy":
    "scene/background: cozy cafe, morning room, or rainy window, warm mug, small table or plant hiding legs, soft calm light, 2-4 background elements max",
  "club-party":
    "scene/background: simple club or party scene, DJ booth or counter hiding legs, purple-blue light beams, tiny speakers, 2-4 background elements max",
  "desk-focus-no-lyrics":
    "scene/background: quiet bedroom desk or studio, window, laptop or desk hiding legs, notebook, small lamp, 2-4 background elements max",
  "stage-concert":
    "scene/background: tiny concert stage, soft spotlights, simple speaker or stage monitor hiding legs, stage floor glow, 2-4 background elements max",
  "bedroom-sad-heartbreak":
    "scene/background: cozy bedroom at night, rainy window, pillow or bed edge hiding legs, tiny phone glow, soft indigo light, 2-4 background elements max",
  "road-trip-car":
    "scene/background: tiny car on an open road, dashboard hiding legs, road lights or dashboard glow, simple skyline or hills, 2-4 background elements max",
};

const THEME_SCENE_PROMPTS: Record<ImageStyle, Record<string, string>> = {
  "editorial-photo": EDITORIAL_PHOTO_SCENE_PROMPTS,
  realistic: EDITORIAL_PHOTO_SCENE_PROMPTS,
  editorial: EDITORIAL_PHOTO_SCENE_PROMPTS,
  elephant: ELEPHANT_SCENE_PROMPTS,
  mascot: ELEPHANT_SCENE_PROMPTS,
  cartoon: {
    "instrumental-focus":
      "stylized person wearing over-ear headphones at a minimal desk, calm focus pose, simple blue background",
    "night-drive":
      "stylized character driving at night with neon window glow, simple dark blue and pink background",
    "rainy-cafe":
      "stylized character holding coffee by a rainy window, cozy focus pose, simple warm beige background",
    "beach-sunset":
      "stylized character relaxing at sunset, open calm pose, simple orange and teal background",
    "gym-power":
      "stylized athlete in hoodie holding a gym bag, confident villain energy, simple red-black background",
    "dark-club":
      "stylized character dancing under colored lights, bold silhouette pose, simple purple and cyan background",
    "party-pregame":
      "stylized character laughing with one drink cup, hype pose, simple warm orange background",
    "rage-cleaning":
      "stylized character cleaning with energetic motion, one spray bottle prop, simple mint background",
    heartbreak:
      "stylized character sitting alone by a window at night, quiet slumped pose, simple indigo background",
    afrobeats:
      "stylized character dancing in warm sunlight, joyful movement, bright orange and yellow background",
    "global-street":
      "stylized character walking with headphones, curious stride, simple teal and gold background",
    "mystery-neon":
      "stylized character standing in neon glow, mysterious still pose, simple magenta and navy background",
    "acoustic-morning":
      "stylized character with acoustic guitar and coffee mug, gentle morning pose, simple cream background",
    "genre-pulse":
      "stylized character showing music-genre attitude, confident stance, simple bold-color background",
    "boundary-filter":
      "stylized character making a firm stop gesture, decisive pose, simple red and white background",
    "main-character":
      "stylized character walking like a movie lead, dramatic stride, simple rose and gold background",
    "soft-chaos":
      "stylized character juggling feelings with playful messy energy, simple pastel background",
    "life-scene":
      "stylized character in an everyday music moment, relaxed pose, simple neutral background",
  },
};

interface CliOptions {
  dedupe: boolean;
  dryRun: boolean;
  force: boolean;
  limit: number;
  only: Set<string> | null;
  style: ImageStyle;
}

interface DocsPromptRow {
  cardId: string;
  title: string;
  filename: string;
  prompt: string;
}

interface ImageJob {
  cardId: string;
  title: string;
  outputSlug: string;
  outputPath: string;
  prompt: string;
  style: ImageStyle;
}

interface GenerationStats {
  generated: number;
  skipped: number;
  failed: number;
}

type FallbackVibeCard = (typeof FALLBACK_VIBE_CARDS)[number];

function isPhotoStyle(style: ImageStyle): boolean {
  return style === "editorial-photo" || style === "realistic" || style === "editorial";
}

function parseStyle(value: string | undefined): ImageStyle {
  if (!value) return "editorial-photo";
  if (
    value === "editorial-photo" ||
    value === "elephant" ||
    value === "mascot" ||
    value === "cartoon" ||
    value === "realistic" ||
    value === "editorial"
  ) {
    return value;
  }
  throw new Error(
    `Unknown style: ${value}. Use editorial-photo, realistic, editorial, elephant, mascot, or cartoon.`
  );
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dedupe: false,
    dryRun: false,
    force: false,
    limit: Number.POSITIVE_INFINITY,
    only: null,
    style: "editorial-photo",
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--force") {
      options.force = true;
      continue;
    }
    if (arg === "--dedupe") {
      options.dedupe = true;
      continue;
    }
    if (arg === "--unique-per-card") {
      options.dedupe = false;
      continue;
    }
    if (arg === "--limit") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("--limit requires a positive number.");
      }
      options.limit = value;
      index += 1;
      continue;
    }
    if (arg === "--only") {
      const value = argv[index + 1];
      if (!value) throw new Error("--only requires a comma-separated list.");
      options.only = new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      );
      index += 1;
      continue;
    }
    if (arg === "--style") {
      options.style = parseStyle(argv[index + 1]);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function splitMarkdownRow(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

async function parseDocsPrompts(): Promise<Map<string, DocsPromptRow>> {
  const docsPath = join(process.cwd(), "docs", "card-image-prompts.md");
  const text = await readFile(docsPath, "utf8");
  const rows = new Map<string, DocsPromptRow>();

  for (const line of text.split("\n")) {
    if (!line.startsWith("|") || line.includes("---") || line.includes("Card ID")) continue;
    const cells = splitMarkdownRow(line);
    if (cells.length < 4) continue;
    const [cardId, title, filename, prompt] = cells;
    if (!cardId || !filename || !prompt) continue;
    rows.set(cardId, { cardId, title, filename, prompt });
  }

  return rows;
}

function outputSlugFromImageUrl(imageUrl: string): string {
  return basename(imageUrl).replace(/\.(jpg|jpeg|png|webp)$/i, "");
}

function stripKnownSuffixes(prompt: string): string {
  let base = prompt.trim().replace(/\s+/g, " ");
  base = base
    .replace(/^colorful cartoon vector-style\s+/i, "")
    .replace(/^clean modern cartoon illustration of\s+/i, "")
    .replace(/^clean modern cartoon illustration,\s*/i, "")
    .replace(/^clean flat vector sticker-style illustration of\s+/i, "")
    .replace(/^clean cartoon sticker-style illustration of\s+/i, "");
  base = base
    .replace(/,?\s*music app card art.*$/i, "")
    .replace(/,?\s*clean flat vector sticker-style illustration.*$/i, "")
    .replace(/,?\s*clean cartoon sticker-style illustration.*$/i, "")
    .replace(/,?\s*realistic(?:\s+editorial)?\s+lifestyle photo.*$/i, "")
    .replace(/,?\s*realistic lifestyle photo.*$/i, "")
    .replace(/,?\s*modern consumer(?:\s+music)?\s+app card.*$/i, "")
    .replace(/,?\s*no text,?\s*no logos.*$/i, "")
    .replace(/,?\s*no watermark.*$/i, "")
    .replace(/,?\s*no distorted.*$/i, "")
    .replace(/,?\s*no extra fingers.*$/i, "")
    .replace(/,?\s*cinematic but not ai-looking.*$/i, "")
    .replace(/,?\s*natural lighting.*$/i, "")
    .trim();
  return base;
}

function elephantSceneFromPrompt(prompt: string): string {
  const scene = stripKnownSuffixes(prompt)
    .replace(
      /^cute original (?:baby )?elephant mascot(?: for a music discovery app)?(?:,? wearing oversized headphones)?\s*/i,
      ""
    )
    .replace(
      /,\s*cute original (?:baby )?elephant mascot(?: for a music discovery app)?(?:,? wearing oversized headphones)?\s*/i,
      ", "
    )
    .replace(/^wearing oversized headphones\s*/i, "")
    .replace(/^and\s+/i, "wearing ")
    .replace(/,?\s*no text,?\s*no logos.*$/i, "")
    .trim();

  return scene || "in an expressive music discovery pose";
}

function hasAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function positiveTraitKeys(card?: FallbackVibeCard): string[] {
  if (!card?.traits) return [];
  return Object.entries(card.traits)
    .filter(([, value]) => Number(value) > 0)
    .map(([key]) => key);
}

function sceneCategoryForCard(input: {
  cardId: string;
  title?: string;
  subtitle?: string;
  visualTheme: string;
  imageAlt: string;
  card?: FallbackVibeCard;
}): ElephantSceneCategory {
  const card = input.card;
  const searchText = [
    input.cardId,
    input.title,
    input.subtitle,
    input.visualTheme,
    input.imageAlt,
    card?.feedback,
    card?.whyText,
    ...(card?.boostGenres ?? []),
    ...(card?.blockGenres ?? []),
    ...(card?.boostLanguages ?? []),
    ...(card?.boostRegions ?? []),
    ...positiveTraitKeys(card),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (hasAny(searchText, ["forest", "nature", "trail", "trees", "woods", "adventure"])) {
    return "forest-nature";
  }
  if (hasAny(searchText, ["afrobeats", "lagos", "sunshine", "sunny street"])) {
    return "sunny-street";
  }
  if (hasAny(searchText, ["beach", "sunset", "sun", "sunlight", "palm", "coastal"])) {
    return "beach-sunset";
  }
  if (hasAny(searchText, ["gym", "workout", "boxing", "pre-workout", "preworkout", "treadmill", "cardio", "rep", "reps"])) {
    return "gym-workout";
  }
  if (hasAny(searchText, ["coffee", "cafe", "café", "rainy", "rain", "cozy", "sunday morning"])) {
    return "cafe-rainy-cozy";
  }
  if (hasAny(searchText, ["acoustic", "morning", "indie folk", "indie-folk"])) {
    return "cafe-rainy-cozy";
  }
  if (hasAny(searchText, ["club", "party", "pregame", "dance", "edm", "bass", "drop", "dj", "speaker", "full volume"])) {
    return "club-party";
  }
  if (hasAny(searchText, ["no lyrics", "focus", "deep work", "desk", "homework", "deadline", "do not shuffle", "piano only", "lo-fi"])) {
    return "desk-focus-no-lyrics";
  }
  if (hasAny(searchText, ["stage", "concert", "shower concert", "chorus", "bridge", "vocals", "jazz", "metal", "bollywood", "k-pop", "pop star"])) {
    return "stage-concert";
  }
  if (hasAny(searchText, ["heartbreak", "sad", "crying", "old texts", "crush", "delete", "empty", "feelings", "3am", "overthinking"])) {
    return "bedroom-sad-heartbreak";
  }
  if (hasAny(searchText, ["road trip", "road-trip", "car", "parking", "highway", "window seat", "bus", "commute"])) {
    return "road-trip-car";
  }
  if (hasAny(searchText, ["night", "neon", "tokyo", "seoul", "city", "walk", "errands", "grocery", "transit", "main character"])) {
    return "city-neon-night-drive";
  }

  switch (input.visualTheme) {
    case "night-drive":
    case "mystery-neon":
    case "global-street":
    case "main-character":
      return "city-neon-night-drive";
    case "beach-sunset":
      return "beach-sunset";
    case "gym-power":
      return "gym-workout";
    case "rainy-cafe":
      return "cafe-rainy-cozy";
    case "dark-club":
    case "party-pregame":
      return "club-party";
    case "instrumental-focus":
      return "desk-focus-no-lyrics";
    case "acoustic-morning":
    case "genre-pulse":
      return "stage-concert";
    case "heartbreak":
    case "soft-chaos":
      return "bedroom-sad-heartbreak";
    default:
      return "city-neon-night-drive";
  }
}

function buildFinalPrompt(
  basePrompt: string,
  style: ImageStyle,
  elephantSceneInstruction?: string
): string {
  const base = stripKnownSuffixes(basePrompt);
  if (style === "elephant" || style === "mascot") {
    return [
      ELEPHANT_STYLE_BASE_PROMPT,
      `scene: ${elephantSceneFromPrompt(basePrompt)}`,
      elephantSceneInstruction,
      "scene-first composition, elephant is inside the scene, show head and upper body only when possible, hide legs behind foreground objects, background is simplified and stylized, avoid clutter, readable at small card size",
    ]
      .filter(Boolean)
      .join(", ");
  }
  if (style === "cartoon") {
    const scene = base.toLowerCase().includes("stylized")
      ? base
      : `${CARTOON_SIMPLICITY}${base}`;
    return `clean modern cartoon illustration of ${scene}, ${STYLE_SUFFIXES.cartoon}`;
  }
  if (isPhotoStyle(style)) {
    return [
      base,
      STYLE_SUFFIXES[style],
      "prefer back-facing people, silhouettes, cropped figures, or no people",
      "prefer environments and objects over faces",
      "avoid detailed hands, direct face closeups, fake influencer portraits, celebrity resemblance, copyrighted album art, and artist imagery",
      "make it feel like a playlist cover or film still",
    ].join(", ");
  }
  const normalizedBase = base;
  return `${normalizedBase}, ${STYLE_SUFFIXES[style]}`;
}

function buildFallbackPrompt(
  input: {
    title?: string;
    subtitle?: string;
    visualTheme: string;
    imageAlt: string;
  },
  style: ImageStyle
): string {
  const scenes = THEME_SCENE_PROMPTS[style];
  const scene = scenes[input.visualTheme] ?? scenes["life-scene"];
  const subject = input.title
    ? `Scene for "${input.title}"`
    : input.imageAlt.split(":")[0] ?? "SoundLife vibe card";
  const detail = input.subtitle ? `, mood: ${input.subtitle}` : "";
  return `${subject}: ${scene}${detail}`;
}

function baseScenePrompt(input: {
  cardId: string;
  definition: (typeof CARD_VISUALS)[string];
  docsRow?: DocsPromptRow;
  title?: string;
  subtitle?: string;
  style: ImageStyle;
}): string {
  if (isPhotoStyle(input.style)) {
    return (
      input.docsRow?.prompt ??
      input.definition.visualPrompt ??
      buildFallbackPrompt(
        {
          title: input.title ?? input.docsRow?.title,
          subtitle: input.subtitle,
          visualTheme: input.definition.visualTheme,
          imageAlt: input.definition.imageAlt,
        },
        input.style
      )
    );
  }

  return (
    input.docsRow?.prompt ??
    buildFallbackPrompt(
      {
        title: input.title ?? input.docsRow?.title,
        subtitle: input.subtitle,
        visualTheme: input.definition.visualTheme,
        imageAlt: input.definition.imageAlt,
      },
      input.style
    )
  );
}

function scoreJobCandidate(input: {
  cardId: string;
  outputSlug: string;
  definition: (typeof CARD_VISUALS)[string];
  docsRow?: DocsPromptRow;
  prompt: string;
}): number {
  let score = 0;
  if (input.outputSlug === input.cardId) score += 120;
  if (input.outputSlug.startsWith(input.cardId.split("-")[0] ?? "")) score += 30;
  if (input.definition.visualPrompt) score += 80;
  if (input.docsRow) score += 40;
  if (input.docsRow?.filename === `${input.outputSlug}.jpg`) score += 60;
  if (input.outputSlug.includes(input.cardId)) score += 20;
  score += Math.min(input.prompt.length / 200, 10);
  return score;
}

function buildJobs(
  docsPrompts: Map<string, DocsPromptRow>,
  style: ImageStyle,
  options: Pick<CliOptions, "dedupe">
): ImageJob[] {
  const cards = new Map(FALLBACK_VIBE_CARDS.map((card) => [card.id, card]));
  const jobs: ImageJob[] = [];
  const jobsByOutput = options.dedupe ? new Map<string, ImageJob>() : null;
  const scoresByOutput = options.dedupe ? new Map<string, number>() : null;

  for (const [cardId, definition] of Object.entries(CARD_VISUALS)) {
    const outputSlug = outputSlugFromImageUrl(definition.imageUrl);
    const docsRow = docsPrompts.get(cardId);
    const card = cards.get(cardId);
    const title = card?.title ?? docsRow?.title;
    const subtitle = card?.subtitle;
    const scenePrompt = baseScenePrompt({
      cardId,
      definition,
      docsRow,
      title,
      subtitle,
      style,
    });
    const elephantSceneInstruction =
      style === "elephant" || style === "mascot"
        ? ELEPHANT_SCENE_CATEGORY_PROMPTS[
            sceneCategoryForCard({
              cardId,
              title,
              subtitle,
              visualTheme: definition.visualTheme,
              imageAlt: definition.imageAlt,
              card,
            })
          ]
        : undefined;
    const prompt = buildFinalPrompt(scenePrompt, style, elephantSceneInstruction);

    const job: ImageJob = {
      cardId,
      title: title ?? cardId,
      outputSlug,
      outputPath: join(OUT_DIR, `${outputSlug}.jpg`),
      prompt,
      style,
    };

    if (!options.dedupe) {
      jobs.push(job);
      continue;
    }

    const score = scoreJobCandidate({
      cardId,
      outputSlug,
      definition,
      docsRow,
      prompt,
    });
    const existingScore = scoresByOutput!.get(outputSlug) ?? -1;
    if (score > existingScore) {
      jobsByOutput!.set(outputSlug, job);
      scoresByOutput!.set(outputSlug, score);
    }
  }

  const result = options.dedupe ? [...jobsByOutput!.values()] : jobs;
  return result.sort((a, b) => a.outputSlug.localeCompare(b.outputSlug));
}

function matchesOnly(job: ImageJob, only: Set<string>): boolean {
  return only.has(job.cardId) || only.has(job.outputSlug);
}

function filterJobs(jobs: ImageJob[], options: CliOptions): ImageJob[] {
  let filtered = jobs;
  if (options.only) {
    filtered = filtered.filter((job) => matchesOnly(job, options.only!));
  }
  if (Number.isFinite(options.limit)) {
    filtered = filtered.slice(0, options.limit);
  }
  return filtered;
}

async function toJpegBuffer(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const sharp = await import("sharp");
    return sharp.default(imageBuffer).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  } catch {
    return imageBuffer;
  }
}

async function requestOpenAiImage(prompt: string, apiKey: string): Promise<Buffer> {
  const gptImageResponse = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
    }),
  });

  if (gptImageResponse.ok) {
    const payload = (await gptImageResponse.json()) as {
      data?: Array<{ b64_json?: string }>;
    };
    const encoded = payload.data?.[0]?.b64_json;
    if (encoded) return Buffer.from(encoded, "base64");
    throw new Error("OpenAI image response did not include image data.");
  }

  const gptImageError = await gptImageResponse.text();
  console.warn(
    `[card-images] gpt-image-1 unavailable (${gptImageResponse.status}). Falling back to dall-e-3. ${gptImageError}`
  );

  const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      quality: "standard",
      response_format: "b64_json",
    }),
  });

  if (!dalleResponse.ok) {
    const body = await dalleResponse.text();
    throw new Error(`OpenAI Images API failed (${dalleResponse.status}): ${body}`);
  }

  const payload = (await dalleResponse.json()) as {
    data?: Array<{ b64_json?: string }>;
  };
  const encoded = payload.data?.[0]?.b64_json;
  if (!encoded) throw new Error("dall-e-3 response did not include image data.");
  return toJpegBuffer(Buffer.from(encoded, "base64"));
}

async function generateCardImages(options: CliOptions): Promise<GenerationStats> {
  loadEnvConfig(process.cwd());
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !options.dryRun) {
    throw new Error("OPENAI_API_KEY not found. Add it to .env.local or export it in your shell.");
  }

  await mkdir(OUT_DIR, { recursive: true });
  const docsPrompts = await parseDocsPrompts();
  const jobs = filterJobs(buildJobs(docsPrompts, options.style, options), options);
  const stats: GenerationStats = { generated: 0, skipped: 0, failed: 0 };

  console.log(`Style: ${options.style}`);
  console.log(`Output mode: ${options.dedupe ? "dedupe" : "unique-per-card"}`);
  console.log(`Card image jobs: ${jobs.length}`);
  console.log(`Output folder: ${OUT_DIR}`);

  for (const job of jobs) {
    const exists = existsSync(job.outputPath);
    if (exists && !options.force) {
      stats.skipped += 1;
      console.log(`[skip] ${job.outputSlug}.jpg (${job.cardId}) already exists`);
      continue;
    }

    if (options.dryRun) {
      stats.generated += 1;
      console.log(`[dry-run] ${job.outputSlug}.jpg (${job.cardId}) [${job.style}]`);
      console.log(`          ${job.prompt}`);
      continue;
    }

    try {
      console.log(`[generate] ${job.outputSlug}.jpg (${job.cardId}) [${job.style}]`);
      const imageBuffer = await requestOpenAiImage(job.prompt, apiKey!);
      await writeFile(job.outputPath, imageBuffer);
      stats.generated += 1;
    } catch (error) {
      stats.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[failed] ${job.cardId} (${job.outputSlug}.jpg): ${message}`);
    }
  }

  return stats;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv);
  const stats = await generateCardImages(options);

  console.log("");
  console.log(`generated: ${stats.generated}`);
  console.log(`skipped: ${stats.skipped}`);
  console.log(`failed: ${stats.failed}`);
  console.log(`output folder: ${OUT_DIR}`);

  if (stats.failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
