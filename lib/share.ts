import { TRAIT_META } from "./data";
import type { ResultData, ShareCardVariant } from "./types";

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
    result.archetype.shareCaption,
    `${result.identity} · ${result.matchPercent}% match`,
    traits,
    `Top songs: ${songs}`,
    "Try yours: SoundLife",
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
