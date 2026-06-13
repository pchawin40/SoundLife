#!/usr/bin/env tsx

import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { CARD_VISUALS } from "../lib/cardVisualMap";
import { FALLBACK_VIBE_CARDS } from "../lib/catalog.fallback";

interface ImageInfo {
  dimensions?: string;
  size?: string;
}

function publicPath(url: string): string {
  return join(process.cwd(), "public", url.replace(/^\//, ""));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function getImageInfo(url: string): Promise<ImageInfo> {
  const filePath = publicPath(url);
  if (!existsSync(filePath)) return {};

  const info: ImageInfo = {
    size: formatBytes(statSync(filePath).size),
  };

  try {
    const sharp = await import("sharp");
    const metadata = await sharp.default(filePath).metadata();
    if (metadata.width && metadata.height) {
      info.dimensions = `${metadata.width}x${metadata.height}`;
    }
  } catch {
    // Dimensions are best-effort; file existence and size are enough for audit output.
  }

  return info;
}

function printSection(title: string, rows: string[]): void {
  console.log("");
  console.log(title);
  if (rows.length === 0) {
    console.log("  none");
    return;
  }
  for (const row of rows) console.log(`  ${row}`);
}

async function main(): Promise<void> {
  const definitions = Object.entries(CARD_VISUALS);
  const catalogCardIds = new Set(FALLBACK_VIBE_CARDS.map((card) => card.id));
  const definitionIds = new Set(definitions.map(([cardId]) => cardId));
  const imagePathMap = new Map<string, string[]>();
  const missingFiles: string[] = [];
  const generatedImageMappings: string[] = [];
  const existingGeneratedFiles: string[] = [];
  const legacyFiles: string[] = [];
  const noImageCards: string[] = [];
  const gradientFallbackCards: string[] = [];

  for (const [cardId, visual] of definitions) {
    const imageUrl = visual.imageUrl;
    if (!imageUrl) {
      noImageCards.push(cardId);
      gradientFallbackCards.push(cardId);
    } else {
      const cards = imagePathMap.get(imageUrl) ?? [];
      cards.push(cardId);
      imagePathMap.set(imageUrl, cards);

      if (imageUrl.startsWith("/images/cards/")) {
        const info = await getImageInfo(imageUrl);
        const exists = existsSync(publicPath(imageUrl));
        const details = `${info.dimensions ? ` (${info.dimensions}` : ""}${
          info.size ? `${info.dimensions ? ", " : " ("}${info.size}` : ""
        }${info.dimensions || info.size ? ")" : ""}`;
        generatedImageMappings.push(
          `${cardId} -> ${imageUrl}${exists ? details : " (missing)"}`
        );
        if (exists) {
          existingGeneratedFiles.push(`${cardId} -> ${imageUrl}${details}`);
        } else {
          missingFiles.push(`${cardId} -> ${imageUrl}`);
        }
      }
    }

    if (visual.legacyImageUrl) {
      const legacyExists = existsSync(publicPath(visual.legacyImageUrl));
      legacyFiles.push(
        `${cardId} -> ${visual.legacyImageUrl}${legacyExists ? "" : " (missing)"}`
      );
    }

    const primaryExists = imageUrl ? existsSync(publicPath(imageUrl)) : false;
    const legacyExists = visual.legacyImageUrl
      ? existsSync(publicPath(visual.legacyImageUrl))
      : false;
    if (!primaryExists && !legacyExists) {
      gradientFallbackCards.push(cardId);
    }
  }

  for (const card of FALLBACK_VIBE_CARDS) {
    if (!definitionIds.has(card.id) && !card.imageUrl) {
      noImageCards.push(card.id);
      gradientFallbackCards.push(card.id);
    }
  }

  const duplicateRows = [...imagePathMap.entries()]
    .filter(([, cards]) => cards.length > 1)
    .map(([url, cards]) => `${url} (${cards.length}): ${cards.join(", ")}`);

  const missingCatalogVisuals = [...catalogCardIds]
    .filter((cardId) => !definitionIds.has(cardId))
    .map((cardId) => `${cardId} -> no CARD_VISUALS entry`);

  console.log("Card image audit");
  console.log(`total cards: ${definitions.length}`);
  console.log(`catalog vibe cards: ${catalogCardIds.size}`);
  console.log(`total unique image paths: ${imagePathMap.size}`);
  console.log(`duplicate image paths: ${duplicateRows.length}`);
  console.log(`missing image files: ${missingFiles.length}`);
  console.log(`gradient fallback count: ${new Set(gradientFallbackCards).size}`);
  console.log(`cards using generated /images/cards/*.jpg: ${generatedImageMappings.length}`);
  console.log(`existing generated JPG files: ${existingGeneratedFiles.length}`);
  console.log(`legacy /vibes/*.png mappings: ${legacyFiles.length}`);
  console.log(`cards with no imageUrl: ${new Set(noImageCards).size}`);

  printSection("duplicate image mappings", duplicateRows);
  printSection("missing generated files", missingFiles);
  printSection("cards using legacy /vibes/*.png", legacyFiles);
  printSection("cards using generated /images/cards/*.jpg", generatedImageMappings);
  printSection("existing generated JPG files", existingGeneratedFiles);
  printSection("cards with no imageUrl", [...new Set(noImageCards)].sort());
  printSection("cards falling back to theme visuals", [...new Set(gradientFallbackCards)].sort());
  printSection("catalog cards missing CARD_VISUALS entry", missingCatalogVisuals);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
