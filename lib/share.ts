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

const PLATFORMS = [
  {
    id: "spotify",
    name: "Spotify",
    color: "#1DB954",
    url: (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  },
  {
    id: "youtube",
    name: "YouTube Music",
    color: "#FF4444",
    url: (q: string) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "apple",
    name: "Apple Music",
    color: "#FA243C",
    url: (q: string) => `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`,
  },
] as const;

export type Platform = (typeof PLATFORMS)[number];

export { PLATFORMS };
