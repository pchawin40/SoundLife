import type { Song } from "./types";

/**
 * Outbound platform links. We never invent track IDs: when a song has no
 * verified platform URL we fall back to that platform's search page.
 * Apple links carry affiliate (`at`) + campaign (`ct`) params.
 */

export const DEFAULT_CAMPAIGN = "soundlife";

export type PlatformId = "spotify" | "youtube-music" | "apple-music";

function songQuery(song: Pick<Song, "title" | "artist">): string {
  return `${song.title} ${song.artist}`;
}

export function buildSpotifyUrl(song: Song): string {
  return (
    song.platforms?.spotifyUrl ||
    `https://open.spotify.com/search/${encodeURIComponent(songQuery(song))}`
  );
}

export function buildYouTubeMusicUrl(song: Song): string {
  const { youtubeVideoId, youtubeMusicUrl } = song.platforms ?? {};
  if (youtubeVideoId) {
    return `https://music.youtube.com/watch?v=${encodeURIComponent(youtubeVideoId)}`;
  }
  return (
    youtubeMusicUrl ||
    `https://music.youtube.com/search?q=${encodeURIComponent(songQuery(song))}`
  );
}

export function buildAppleMusicUrl(
  song: Song,
  campaign: string = DEFAULT_CAMPAIGN
): string {
  const base =
    song.platforms?.appleMusicUrl ||
    `https://music.apple.com/us/search?term=${encodeURIComponent(songQuery(song))}`;

  try {
    const url = new URL(base);
    url.searchParams.set("app", "music");
    const token = process.env.NEXT_PUBLIC_APPLE_AFFILIATE_TOKEN;
    if (token) url.searchParams.set("at", token);
    url.searchParams.set("ct", campaign);
    return url.toString();
  } catch {
    return base;
  }
}

export interface PlatformLink {
  id: PlatformId;
  name: string;
  shortName: string;
  color: string;
  href: string;
}

export function getPlatformLinks(
  song: Song,
  campaign: string = DEFAULT_CAMPAIGN
): PlatformLink[] {
  return [
    {
      id: "spotify",
      name: "Spotify",
      shortName: "Spotify",
      color: "#1DB954",
      href: buildSpotifyUrl(song),
    },
    {
      id: "youtube-music",
      name: "YouTube Music",
      shortName: "YouTube",
      color: "#FF4444",
      href: buildYouTubeMusicUrl(song),
    },
    {
      id: "apple-music",
      name: "Apple Music",
      shortName: "Apple",
      color: "#FA243C",
      href: buildAppleMusicUrl(song, campaign),
    },
  ];
}
