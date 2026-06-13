import { createClient } from "@supabase/supabase-js";
import { FALLBACK_SONGS } from "../lib/catalog.fallback";
import type { Song } from "../lib/types";

const ITUNES_URL = "https://itunes.apple.com/search";
const REQUEST_DELAY_MS = 3100;
const MAX_REFRESH_ROWS = Number(process.env.CATALOG_REFRESH_LIMIT ?? 80);

interface ItunesTrack {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  country?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function artwork600(url?: string): string | null {
  if (!url) return null;
  return url.replace(/100x100bb\.(jpg|png)$/i, "600x600bb.$1");
}

function queryFor(song: Song): string {
  return `${song.title} ${song.artist}`;
}

async function searchItunes(song: Song): Promise<ItunesTrack | null> {
  const url = new URL(ITUNES_URL);
  url.searchParams.set("term", queryFor(song));
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "1");
  url.searchParams.set("media", "music");

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`iTunes ${response.status} for ${song.title} - ${song.artist}`);
    return null;
  }
  const data = (await response.json()) as { results?: ItunesTrack[] };
  return data.results?.[0] ?? null;
}

async function main(): Promise<void> {
  if (process.env.ENABLE_CATALOG_REFRESH !== "true") {
    console.log("Catalog refresh disabled. Set ENABLE_CATALOG_REFRESH=true to run.");
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let searched = 0;
  let updated = 0;
  let inserted = 0;
  let skipped = 0;

  for (const song of FALLBACK_SONGS.slice(0, MAX_REFRESH_ROWS)) {
    if (searched > 0) await sleep(REQUEST_DELAY_MS);
    searched += 1;

    const track = await searchItunes(song);
    if (!track?.trackId || !track.trackName || !track.artistName) {
      skipped += 1;
      continue;
    }

    const row = {
      title: track.trackName,
      artist: track.artistName,
      language: song.language,
      region: song.region,
      country: track.country?.toLowerCase() ?? song.country ?? null,
      genres: song.genres.length > 0 ? song.genres : [normalize(track.primaryGenreName ?? "pop")],
      moods: song.moods ?? [],
      era: song.era ?? null,
      apple_music_url: track.trackViewUrl ?? song.platforms.appleMusicUrl ?? null,
      spotify_url: song.platforms.spotifyUrl ?? null,
      youtube_music_url: song.platforms.youtubeMusicUrl ?? null,
      youtube_video_id: song.platforms.youtubeVideoId ?? null,
      preview_url: track.previewUrl ?? null,
      artwork_url: artwork600(track.artworkUrl100),
      itunes_track_id: String(track.trackId),
      traits: song.traits,
      scenarios: song.scenarios,
      chips: song.chips,
      popularity_score: song.popularity ?? 0,
      is_active: true,
    };

    const { data: existing, error: existingError } = await supabase
      .from("songs")
      .select("id,title,artist")
      .ilike("title", row.title)
      .ilike("artist", row.artist)
      .limit(1)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing?.id) {
      const { error } = await supabase.from("songs").update(row).eq("id", existing.id);
      if (error) throw error;
      updated += 1;
    } else {
      const { error } = await supabase.from("songs").insert(row);
      if (error) throw error;
      inserted += 1;
    }
  }

  const { data: versionRow } = await supabase
    .from("catalog_versions")
    .select("version")
    .eq("id", "catalog")
    .maybeSingle();
  const nextVersion = Number(versionRow?.version ?? 0) + 1;
  const { error: versionError } = await supabase
    .from("catalog_versions")
    .upsert({ id: "catalog", version: nextVersion, published_at: new Date().toISOString() });
  if (versionError) throw versionError;

  console.log(
    JSON.stringify(
      { searched, updated, inserted, skipped, catalogVersion: nextVersion },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
