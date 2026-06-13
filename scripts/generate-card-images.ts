#!/usr/bin/env tsx
/**
 * CI/dev-only card image generator. Never imported by the Next.js app.
 * Requires OPENAI_API_KEY in the environment or .env.local.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { CARD_VISUALS } from "../lib/cardVisualMap";
import { FALLBACK_VIBE_CARDS } from "../lib/catalog.fallback";

const OUT_DIR = join(process.cwd(), "public", "images", "cards");
const PROMPT_SUFFIX =
  "realistic editorial lifestyle photo, modern consumer music app card, cinematic natural lighting, human-feeling, no text, no logos, no watermark, no distorted faces, no extra fingers";

const THEME_SCENE_PROMPTS: Record<string, string> = {
  "instrumental-focus":
    "person wearing headphones in a minimal workspace at night with soft ambient light and calm focus",
  "night-drive":
    "neon city street at night seen from inside a car with rain on the windshield",
  "rainy-cafe": "cozy coffee shop window with rain outside and warm interior light",
  "beach-sunset": "soft beach sunset with golden light and relaxed coastal mood",
  "gym-power": "intense gym training scene with dramatic lighting and focused energy",
  "dark-club": "dark nightclub with silhouettes, colored lights, and bass-heavy atmosphere",
  "party-pregame": "friends laughing in a kitchen before going out with warm candid energy",
  "rage-cleaning": "person energetically cleaning a bright apartment with motion and purpose",
  heartbreak: "quiet emotional moment alone near a window at night with cinematic mood",
  afrobeats: "sunlit street scene with warm golden light and joyful movement",
  "global-street":
    "city street walker wearing headphones discovering music from another culture",
  "mystery-neon": "moody neon portrait scene with cinematic mystery and late-night feeling",
  "acoustic-morning": "warm morning light over acoustic guitar and coffee on a wooden table",
  "genre-pulse": "authentic music-culture scene with editorial detail and natural color",
  "boundary-filter": "decisive taste-filter moment with bold contrast and clean composition",
  "main-character": "everyday errand turned cinematic with dramatic natural light",
  "soft-chaos": "soft but chaotic personal moment with pastel light and emotional texture",
  "life-scene": "everyday lifestyle scene with natural candid energy",
};

interface CliOptions {
  dryRun: boolean;
  force: boolean;
  limit: number;
  only: Set<string> | null;
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
}

interface GenerationStats {
  generated: number;
  skipped: number;
  failed: number;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    force: false,
    limit: Number.POSITIVE_INFINITY,
    only: null,
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
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function loadEnvFiles(): Promise<void> {
  for (const filename of [".env.local", ".env"]) {
    const path = join(process.cwd(), filename);
    if (!existsSync(path)) continue;
    const text = await readFile(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed
        .slice(separator + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
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

function ensurePromptSuffix(prompt: string): string {
  const normalized = prompt
    .trim()
    .replace(/\s+/g, " ")
    .replace(
      /,?\s*realistic editorial lifestyle photo, modern consumer (?:music )?app card.*$/i,
      ""
    )
    .trim();
  return `${normalized}, ${PROMPT_SUFFIX}`;
}

function buildFallbackPrompt(input: {
  title?: string;
  subtitle?: string;
  visualTheme: string;
  imageAlt: string;
}): string {
  const scene =
    THEME_SCENE_PROMPTS[input.visualTheme] ??
    THEME_SCENE_PROMPTS["life-scene"];
  const subject = input.title
    ? `Scene for "${input.title}"`
    : input.imageAlt.split(":")[0] ?? "SoundLife vibe card";
  const detail = input.subtitle ? `, mood: ${input.subtitle}` : "";
  return `${subject}: ${scene}${detail}`;
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
  if (input.definition.visualPrompt) score += 80;
  if (input.docsRow) score += 40;
  if (input.docsRow?.filename === `${input.outputSlug}.jpg`) score += 60;
  if (input.outputSlug.includes(input.cardId)) score += 20;
  score += Math.min(input.prompt.length / 200, 10);
  return score;
}

function buildJobs(docsPrompts: Map<string, DocsPromptRow>): ImageJob[] {
  const titles = new Map(FALLBACK_VIBE_CARDS.map((card) => [card.id, card.title]));
  const subtitles = new Map(FALLBACK_VIBE_CARDS.map((card) => [card.id, card.subtitle]));
  const jobsByOutput = new Map<string, ImageJob>();
  const scoresByOutput = new Map<string, number>();

  for (const [cardId, definition] of Object.entries(CARD_VISUALS)) {
    const outputSlug = outputSlugFromImageUrl(definition.imageUrl);
    const docsRow = docsPrompts.get(cardId);
    const prompt = ensurePromptSuffix(
      definition.visualPrompt ??
        docsRow?.prompt ??
        buildFallbackPrompt({
          title: titles.get(cardId) ?? docsRow?.title,
          subtitle: subtitles.get(cardId),
          visualTheme: definition.visualTheme,
          imageAlt: definition.imageAlt,
        })
    );

    const job: ImageJob = {
      cardId,
      title: titles.get(cardId) ?? docsRow?.title ?? cardId,
      outputSlug,
      outputPath: join(OUT_DIR, `${outputSlug}.jpg`),
      prompt,
    };

    const score = scoreJobCandidate({
      cardId,
      outputSlug,
      definition,
      docsRow,
      prompt,
    });
    const existingScore = scoresByOutput.get(outputSlug) ?? -1;
    if (score > existingScore) {
      jobsByOutput.set(outputSlug, job);
      scoresByOutput.set(outputSlug, score);
    }
  }

  return [...jobsByOutput.values()].sort((a, b) => a.outputSlug.localeCompare(b.outputSlug));
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
  await loadEnvFiles();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !options.dryRun) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local or your shell environment.");
  }

  await mkdir(OUT_DIR, { recursive: true });
  const docsPrompts = await parseDocsPrompts();
  const jobs = filterJobs(buildJobs(docsPrompts), options);
  const stats: GenerationStats = { generated: 0, skipped: 0, failed: 0 };

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
      console.log(`[dry-run] ${job.outputSlug}.jpg (${job.cardId})`);
      console.log(`          ${job.prompt}`);
      continue;
    }

    try {
      console.log(`[generate] ${job.outputSlug}.jpg (${job.cardId})`);
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
