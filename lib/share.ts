import { TRAIT_META } from "./data";
import type { ResultData } from "./types";

export function buildShareText(result: ResultData): string {
  const traits = result.traits
    .slice(0, 3)
    .map((s) => `${TRAIT_META[s.trait].label} ${s.percent}`)
    .join(" · ");
  const songs = result.songs
    .slice(0, 3)
    .map((s) => s.title)
    .join(", ");
  return [
    `My SoundLife today: ${result.identity}`,
    traits,
    `Songs: ${songs}`,
    "Try yours: SoundLife ✨",
  ].join("\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
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
  scenarioEmoji: string
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const primary = TRAIT_META[result.traits[0].trait];
  const secondary = TRAIT_META[result.traits[1]?.trait ?? result.traits[0].trait];

  // Background + two soft trait-colored glows
  ctx.fillStyle = "#13100D";
  ctx.fillRect(0, 0, SIZE, SIZE);
  paintGlow(ctx, SIZE * 0.16, SIZE * 0.1, SIZE * 0.55, primary.color);
  paintGlow(ctx, SIZE * 0.9, SIZE * 0.95, SIZE * 0.5, secondary.color);

  const sans =
    '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Noto Sans Thai", sans-serif';
  const cream = "#F5F1EA";

  // Header
  ctx.fillStyle = "rgba(245,241,234,0.6)";
  ctx.font = `900 34px ${sans}`;
  ctx.fillText("S O U N D L I F E", PAD, PAD + 24);
  ctx.font = `64px ${sans}`;
  ctx.fillText(scenarioEmoji, SIZE - PAD - 64, PAD + 36);

  // Identity (wrapped, up to 3 lines)
  ctx.fillStyle = cream;
  ctx.font = `900 96px ${sans}`;
  const lines = wrapText(ctx, result.identity, SIZE - PAD * 2).slice(0, 3);
  let y = PAD + 200;
  for (const line of lines) {
    ctx.fillText(line, PAD, y);
    y += 108;
  }

  // Match pill
  y += 8;
  const pillText = `${result.matchPercent}% match`;
  ctx.font = `700 44px ${sans}`;
  const pillWidth = ctx.measureText(pillText).width + 96;
  roundRect(ctx, PAD, y - 52, pillWidth, 80, 40);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.fillStyle = primary.color;
  ctx.beginPath();
  ctx.arc(PAD + 44, y - 12, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cream;
  ctx.fillText(pillText, PAD + 72, y + 4);

  // Top 3 traits with bars
  y += 120;
  ctx.font = `700 36px ${sans}`;
  ctx.fillStyle = "rgba(245,241,234,0.45)";
  ctx.fillText("T O P  T R A I T S", PAD, y);
  y += 56;
  const barWidth = SIZE - PAD * 2 - 320;
  for (const stat of result.traits.slice(0, 3)) {
    const meta = TRAIT_META[stat.trait];
    ctx.fillStyle = cream;
    ctx.font = `700 40px ${sans}`;
    ctx.fillText(`${meta.emoji} ${meta.label}`, PAD, y + 14);
    roundRect(ctx, PAD + 320, y - 12, barWidth, 24, 12);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    roundRect(ctx, PAD + 320, y - 12, Math.max(24, (barWidth * stat.percent) / 100), 24, 12);
    ctx.fillStyle = meta.color;
    ctx.fill();
    y += 76;
  }

  // Top 3 songs
  y += 28;
  ctx.font = `700 36px ${sans}`;
  ctx.fillStyle = "rgba(245,241,234,0.45)";
  ctx.fillText("O N  R E P E A T", PAD, y);
  y += 60;
  for (const song of result.songs.slice(0, 3)) {
    ctx.fillStyle = cream;
    ctx.font = `800 42px ${sans}`;
    const title = truncate(ctx, song.title, SIZE - PAD * 2);
    ctx.fillText(title, PAD, y);
    ctx.fillStyle = "rgba(245,241,234,0.55)";
    ctx.font = `500 34px ${sans}`;
    ctx.fillText(truncate(ctx, song.artist, SIZE - PAD * 2), PAD, y + 44);
    y += 110;
  }

  // Footer
  ctx.fillStyle = "rgba(245,241,234,0.4)";
  ctx.font = `600 32px ${sans}`;
  ctx.fillText("swipe your vibe ✦ soundlife", PAD, SIZE - PAD + 12);

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
  ctx.fillRect(0, 0, SIZE, SIZE);
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
