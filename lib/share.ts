import { TRAIT_META } from "./data";
import { deriveIdentityRarity } from "./streak";
import type { IdentityRarity, ResultData, ShareCardVariant, TraitStat } from "./types";

const RARITY_HEX: Record<IdentityRarity, string> = {
  common: "#D4D4D8",
  uncommon: "#2DD4BF",
  rare: "#C084FC",
  legendary: "#FBBF24",
};

function traitBar(stat: TraitStat): string {
  const filled = Math.max(1, Math.min(5, Math.round(stat.percent / 20)));
  return `${"🟩".repeat(filled)}${"⬜".repeat(5 - filled)}`;
}

export function buildShareText(result: ResultData, shareUrl = "/result"): string {
  const traits = result.traits
    .slice(0, 3)
    .map((s) => `${TRAIT_META[s.trait].emoji} ${TRAIT_META[s.trait].label} ${traitBar(s)} ${s.percent}%`)
    .join("\n");
  const songs = result.songs
    .slice(0, 3)
    .map((s, i) => `${i + 1}. ${s.title} - ${s.artist}`)
    .join("\n");
  return [
    result.archetype.shareCaption,
    `${result.identity} · ${result.matchPercent}% match`,
    "",
    traits,
    "",
    "Top songs:",
    songs,
    "",
    `Try yours: ${shareUrl}`,
  ].join("\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/* ------------------------- share image ------------------------- */

const SIZE = 1080;
const PAD = 96;

/**
 * Draws the square result card to an offscreen canvas and returns a PNG
 * blob. Pure Canvas 2D — no DOM-capture library, works inside Capacitor.
 */
export async function renderShareImage(
  result: ResultData,
  scenarioEmoji: string,
  variant: ShareCardVariant = "identity"
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const primary = TRAIT_META[result.traits[0].trait];
  const secondary = TRAIT_META[result.traits[1]?.trait ?? result.traits[0].trait];

  const sans =
    '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Noto Sans Thai", sans-serif';
  const cream = "#F5F1EA";

  if (variant === "identity") {
    ctx.fillStyle = "#13100D";
    ctx.fillRect(0, 0, SIZE, SIZE);
    paintGlow(ctx, SIZE * 0.16, SIZE * 0.1, SIZE * 0.55, primary.color);
    paintGlow(ctx, SIZE * 0.9, SIZE * 0.95, SIZE * 0.5, secondary.color);

    ctx.fillStyle = "rgba(245,241,234,0.6)";
    ctx.font = `900 34px ${sans}`;
    ctx.fillText("S O U N D L I F E", PAD, PAD + 24);
    ctx.font = `64px ${sans}`;
    ctx.fillText(result.archetype.emoji || scenarioEmoji, SIZE - PAD - 64, PAD + 36);

    ctx.fillStyle = cream;
    ctx.font = `900 ${result.identity.length > 24 ? 78 : 88}px ${sans}`;
    let y = drawWrappedText(ctx, result.identity, PAD, PAD + 178, SIZE - PAD * 2, 88, 3);

    y += 20;
    const pillText = `${result.matchPercent}% match`;
    ctx.font = `700 42px ${sans}`;
    const pillWidth = ctx.measureText(pillText).width + 96;
    roundRect(ctx, PAD, y - 52, pillWidth, 76, 38);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.fillStyle = primary.color;
    ctx.beginPath();
    ctx.arc(PAD + 42, y - 14, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cream;
    ctx.fillText(pillText, PAD + 70, y);

    y += 64;
    ctx.fillStyle = "rgba(245,241,234,0.78)";
    ctx.font = `700 32px ${sans}`;
    y = drawWrappedText(ctx, result.archetype.diagnosis, PAD, y, SIZE - PAD * 2, 42, 2) + 26;

    ctx.font = `700 30px ${sans}`;
    ctx.fillStyle = "rgba(245,241,234,0.45)";
    ctx.fillText("T O P  T R A I T S", PAD, y);
    y += 48;
    const barWidth = SIZE - PAD * 2 - 300;
    for (const stat of result.traits.slice(0, 3)) {
      const meta = TRAIT_META[stat.trait];
      ctx.fillStyle = cream;
      ctx.font = `700 34px ${sans}`;
      ctx.fillText(`${meta.emoji} ${meta.label}`, PAD, y + 12);
      roundRect(ctx, PAD + 300, y - 12, barWidth, 22, 11);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fill();
      roundRect(ctx, PAD + 300, y - 12, Math.max(22, (barWidth * stat.percent) / 100), 22, 11);
      ctx.fillStyle = meta.color;
      ctx.fill();
      y += 58;
    }

    y += 14;
    ctx.font = `700 30px ${sans}`;
    ctx.fillStyle = "rgba(245,241,234,0.45)";
    ctx.fillText("T O P  3  S O N G S", PAD, y);
    y += 46;
    for (const song of result.songs.slice(0, 3)) {
      ctx.fillStyle = cream;
      ctx.font = `800 34px ${sans}`;
      ctx.fillText(truncate(ctx, song.title, SIZE - PAD * 2), PAD, y);
      ctx.fillStyle = "rgba(245,241,234,0.55)";
      ctx.font = `500 28px ${sans}`;
      ctx.fillText(truncate(ctx, song.artist, SIZE - PAD * 2), PAD, y + 34);
      y += 76;
    }

    ctx.fillStyle = "rgba(245,241,234,0.4)";
    ctx.font = `600 30px ${sans}`;
    ctx.fillText("swipe your vibe ✦ soundlife", PAD, SIZE - PAD + 12);
  } else {
    const theme = result.archetype.colorTheme;
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, SIZE, SIZE);
    paintGlow(ctx, SIZE * 0.18, SIZE * 0.16, SIZE * 0.62, theme.accent);
    paintGlow(ctx, SIZE * 0.9, SIZE * 0.86, SIZE * 0.42, primary.color);

    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = `900 34px ${sans}`;
    ctx.fillText("S O U N D L I F E", PAD, PAD + 24);
    ctx.font = `64px ${sans}`;
    ctx.fillText(variant === "roast" ? result.archetype.sticker : scenarioEmoji, SIZE - PAD - 64, PAD + 36);

    ctx.fillStyle = "rgba(255,255,255,0.48)";
    ctx.font = `900 32px ${sans}`;
    ctx.fillText(variant === "roast" ? "R O A S T  C A R D" : "W H O  G E T S  A U X ?", PAD, PAD + 150);

    ctx.fillStyle = theme.text;
    ctx.font = `900 ${result.identity.length > 24 ? 76 : 88}px ${sans}`;
    let y = drawWrappedText(ctx, result.identity, PAD, PAD + 252, SIZE - PAD * 2, 88, 3) + 18;

    if (variant === "roast") {
      ctx.fillStyle = theme.text;
      ctx.font = `900 50px ${sans}`;
      y = drawWrappedText(ctx, result.archetype.roastCopy, PAD, y + 32, SIZE - PAD * 2, 62, 4);
      y = Math.max(y + 40, SIZE - PAD - 190);

      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.font = `900 28px ${sans}`;
      ctx.fillText("D O  N O T  P L A Y  T H I S  A R O U N D", PAD, y);
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = `700 34px ${sans}`;
      drawWrappedText(ctx, result.archetype.dangerousAround, PAD, y + 50, SIZE - PAD * 2, 44, 3);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.font = `900 28px ${sans}`;
      ctx.fillText("B E S T  F O R", PAD, y + 30);
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = `700 34px ${sans}`;
      y = drawWrappedText(ctx, result.archetype.bestFor, PAD, y + 80, SIZE - PAD * 2, 44, 3) + 28;

      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.font = `900 28px ${sans}`;
      ctx.fillText("D A N G E R O U S  A R O U N D", PAD, y);
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = `700 32px ${sans}`;
      y = drawWrappedText(ctx, result.archetype.dangerousAround, PAD, y + 48, SIZE - PAD * 2, 42, 3) + 34;

      drawTags(ctx, result.vibeTags.slice(0, 5), PAD, Math.min(y, SIZE - PAD - 120), sans);
    }

    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.font = `600 30px ${sans}`;
    ctx.fillText("swipe your vibe ✦ soundlife", PAD, SIZE - PAD + 12);
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function paintGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `${color}3D`);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const tentative = line ? `${line} ${word}` : word;
    if (ctx.measureText(tentative).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tentative;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const lines = wrapText(ctx, text, maxWidth).slice(0, maxLines);
  let currentY = y;
  for (const line of lines) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function drawTags(
  ctx: CanvasRenderingContext2D,
  tags: string[],
  x: number,
  y: number,
  fontFamily: string
): void {
  let cursorX = x;
  let cursorY = y;
  ctx.font = `900 24px ${fontFamily}`;
  for (const tag of tags) {
    const label = tag.toUpperCase();
    const width = ctx.measureText(label).width + 44;
    if (cursorX + width > SIZE - PAD) {
      cursorX = x;
      cursorY += 54;
    }
    roundRect(ctx, cursorX, cursorY - 30, width, 42, 21);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillText(label, cursorX + 22, cursorY - 2);
    cursorX += width + 14;
  }
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}

/* ---------------------- story card (9:16) ---------------------- */

const STORY_W = 1080;
const STORY_H = 1920;
const SPAD = 84;

const STORY_SANS =
  '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Noto Sans Thai", sans-serif';

function drawMatchRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  percent: number,
  color: string,
  textColor: string
): void {
  ctx.save();
  ctx.lineWidth = 18;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (percent / 100));
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.textAlign = "center";
  ctx.fillStyle = textColor;
  ctx.font = `900 56px ${STORY_SANS}`;
  ctx.fillText(`${percent}%`, cx, cy + 6);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `900 22px ${STORY_SANS}`;
  ctx.fillText("M A T C H", cx, cy + 44);
  ctx.restore();
}

function drawRarityPill(
  ctx: CanvasRenderingContext2D,
  rarity: IdentityRarity,
  rightX: number,
  topY: number
): void {
  const color = RARITY_HEX[rarity];
  const label = rarity.toUpperCase();
  ctx.font = `900 28px ${STORY_SANS}`;
  const w = ctx.measureText(label).width + 64;
  const x = rightX - w;
  roundRect(ctx, x, topY, w, 56, 28);
  ctx.fillStyle = `${color}24`;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = `${color}88`;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(label, x + 32, topY + 38);
}

function drawStory(
  ctx: CanvasRenderingContext2D,
  result: ResultData,
  scenarioEmoji: string
): void {
  const primary = TRAIT_META[result.traits[0].trait];
  const secondary = TRAIT_META[result.traits[1]?.trait ?? result.traits[0].trait];
  const theme = result.archetype.colorTheme;
  const cream = theme.text || "#F5F1EA";
  const rarity = deriveIdentityRarity(
    result.traits.slice(0, 3).map((t) => t.trait),
    result.matchPercent
  );

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, STORY_W, STORY_H);
  paintGlow(ctx, STORY_W * 0.5, STORY_H * 0.04, STORY_W * 0.9, theme.accent);
  paintGlow(ctx, STORY_W * 0.88, STORY_H * 0.92, STORY_W * 0.65, primary.color);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `900 30px ${STORY_SANS}`;
  ctx.fillText("S O U N D L I F E", SPAD, SPAD + 38);
  drawRarityPill(ctx, rarity, STORY_W - SPAD, SPAD + 4);

  ctx.fillStyle = cream;
  ctx.font = `120px ${STORY_SANS}`;
  ctx.fillText(result.archetype.emoji || scenarioEmoji, SPAD, SPAD + 232);

  ctx.fillStyle = cream;
  const nameSize = result.identity.length > 22 ? 92 : 112;
  ctx.font = `900 ${nameSize}px ${STORY_SANS}`;
  let y = drawWrappedText(ctx, result.identity, SPAD, SPAD + 372, STORY_W * 0.6, nameSize * 1.02, 3);
  drawMatchRing(ctx, STORY_W - SPAD - 104, SPAD + 322, 100, result.matchPercent, primary.color, cream);

  y += 34;
  ctx.fillStyle = "rgba(255,255,255,0.74)";
  ctx.font = `600 42px ${STORY_SANS}`;
  const hook =
    result.roastIntensity === "roast" ? result.archetype.roastCopy : result.archetype.diagnosis;
  y = drawWrappedText(ctx, hook, SPAD, y, STORY_W - SPAD * 2, 56, 3) + 48;

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `900 28px ${STORY_SANS}`;
  ctx.fillText("Y O U R  S O U N D", SPAD, y);
  y += 56;
  const barX = SPAD + 360;
  const barW = STORY_W - SPAD - barX;
  for (const stat of result.traits.slice(0, 3)) {
    const meta = TRAIT_META[stat.trait];
    ctx.fillStyle = cream;
    ctx.font = `700 40px ${STORY_SANS}`;
    ctx.fillText(`${meta.emoji} ${meta.label}`, SPAD, y + 16);
    roundRect(ctx, barX, y - 6, barW, 24, 12);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fill();
    roundRect(ctx, barX, y - 6, Math.max(24, (barW * stat.percent) / 100), 24, 12);
    ctx.fillStyle = meta.color;
    ctx.fill();
    y += 70;
  }

  y += 30;
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `900 28px ${STORY_SANS}`;
  ctx.fillText("T O N I G H T ' S  T O P  3", SPAD, y);
  y += 64;
  let rank = 1;
  for (const song of result.songs.slice(0, 3)) {
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `900 38px ${STORY_SANS}`;
    ctx.fillText(String(rank), SPAD, y);
    ctx.fillStyle = cream;
    ctx.font = `800 44px ${STORY_SANS}`;
    ctx.fillText(truncate(ctx, song.title, STORY_W - SPAD * 2 - 72), SPAD + 60, y);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `500 34px ${STORY_SANS}`;
    ctx.fillText(truncate(ctx, song.artist, STORY_W - SPAD * 2 - 72), SPAD + 60, y + 44);
    y += 104;
    rank += 1;
  }

  ctx.fillStyle = `${secondary.color}1F`;
  roundRect(ctx, SPAD, STORY_H - SPAD - 150, STORY_W - SPAD * 2, 132, 32);
  ctx.fill();
  ctx.fillStyle = cream;
  ctx.font = `800 48px ${STORY_SANS}`;
  ctx.fillText("what's your sound?", SPAD + 44, STORY_H - SPAD - 84);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `600 34px ${STORY_SANS}`;
  ctx.fillText("soundlife.app · swipe yours in 30s", SPAD + 44, STORY_H - SPAD - 40);
}

export async function renderStoryImage(
  result: ResultData,
  scenarioEmoji: string
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = STORY_W;
  canvas.height = STORY_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawStory(ctx, result, scenarioEmoji);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function renderStoryDataUrl(
  result: ResultData,
  scenarioEmoji: string
): string | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = STORY_W;
  canvas.height = STORY_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawStory(ctx, result, scenarioEmoji);
  return canvas.toDataURL("image/png");
}
