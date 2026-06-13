import { FALLBACK_CATALOG } from "./catalog.fallback";
import { getSupabase } from "./supabaseClient";
import type {
  Catalog,
  ReasonChip,
  Scenario,
  ScenarioId,
  Song,
  TraitScores,
  VibeCardData,
} from "./types";

/**
 * Hybrid catalog: the bundled fallback renders instantly, a cached copy
 * from localStorage upgrades it, and Supabase revalidates in the
 * background — the UI only changes when a strictly newer version lands.
 */

const CACHE_KEY = "soundlife:catalog:v1";
/** Don't even version-check Supabase more often than this. */
const REVALIDATE_INTERVAL_MS = 15 * 60 * 1000;
/** Hard cap on rows per table so a runaway catalog can't blow up egress. */
const MAX_ROWS = 500;

interface CachedEntry {
  catalog: Catalog;
  fetchedAt: number;
}

/* ------------------------------- cache ------------------------------ */

export function getCachedCatalog(): Catalog | null {
  return readCache()?.catalog ?? null;
}

export function saveCachedCatalog(catalog: Catalog): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CachedEntry = { catalog, fetchedAt: Date.now() };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full or blocked — cache is an optimization, not a requirement.
  }
}

function readCache(): CachedEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    if (
      typeof entry?.catalog?.version !== "number" ||
      !Array.isArray(entry.catalog.songs) ||
      !Array.isArray(entry.catalog.vibeCards) ||
      !Array.isArray(entry.catalog.scenarios)
    ) {
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

/* ---------------------------- public API ----------------------------- */

/**
 * Returns the best catalog available right now (cached if newer than the
 * bundled fallback) and kicks off a non-blocking Supabase revalidation.
 * `onUpdate` fires only when a strictly newer catalog version arrives.
 */
export function loadCatalog(onUpdate?: (catalog: Catalog) => void): Catalog {
  const cached = readCache();
  const current =
    cached && cached.catalog.version > FALLBACK_CATALOG.version
      ? cached.catalog
      : FALLBACK_CATALOG;

  const checkedRecently =
    cached !== null && Date.now() - cached.fetchedAt < REVALIDATE_INTERVAL_MS;
  if (!checkedRecently) {
    void revalidate(current, onUpdate);
  }

  return current;
}

async function revalidate(
  current: Catalog,
  onUpdate?: (catalog: Catalog) => void
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    // Tiny version probe first; only pull the full catalog when it's newer.
    const { data: versionRow, error } = await supabase
      .from("catalog_versions")
      .select("version")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !versionRow) return;

    const remoteVersion = Number(versionRow.version);
    if (!Number.isFinite(remoteVersion) || remoteVersion <= current.version) {
      // Bump fetchedAt so we don't re-probe on every load.
      saveCachedCatalog(current);
      return;
    }

    const remote = await fetchRemoteCatalog(remoteVersion);
    if (!remote) return;

    const merged = mergeCatalogs(FALLBACK_CATALOG, remote);
    saveCachedCatalog(merged);
    onUpdate?.(merged);
  } catch {
    // Network/Supabase failure never degrades the experience.
  }
}

async function fetchRemoteCatalog(version: number): Promise<Catalog | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const [songsRes, cardsRes, scenariosRes] = await Promise.all([
    supabase
      .from("songs")
      .select(
        "id,title,artist,language,region,genres,era,spotify_url,apple_music_url,youtube_music_url,youtube_video_id,traits,scenarios,chips,popularity_score"
      )
      .eq("is_active", true)
      .order("popularity_score", { ascending: false })
      .limit(MAX_ROWS),
    supabase
      .from("vibe_cards")
      .select("id,emoji,title,subtitle,traits,feedback")
      .eq("is_active", true)
      .limit(MAX_ROWS),
    supabase
      .from("scenarios")
      .select("id,emoji,label,tagline,base_traits,deck")
      .eq("is_active", true)
      .limit(50),
  ]);

  if (songsRes.error || cardsRes.error || scenariosRes.error) return null;

  return {
    version,
    songs: (songsRes.data ?? []).map(mapSongRow).filter(isSong),
    vibeCards: (cardsRes.data ?? []).map(mapVibeCardRow).filter(isVibeCard),
    scenarios: (scenariosRes.data ?? []).map(mapScenarioRow).filter(isScenario),
  };
}

/** Remote rows win; fallback rows the remote doesn't know about survive. */
export function mergeCatalogs(base: Catalog, remote: Catalog): Catalog {
  const songKey = (s: Song) => `${s.title}::${s.artist}`.toLowerCase();
  const songs = new Map(base.songs.map((s) => [songKey(s), s]));
  for (const song of remote.songs) songs.set(songKey(song), song);

  const cards = new Map(base.vibeCards.map((c) => [c.id, c]));
  for (const card of remote.vibeCards) cards.set(card.id, card);

  const scenarios = new Map(base.scenarios.map((s) => [s.id, s]));
  for (const scenario of remote.scenarios) scenarios.set(scenario.id, scenario);

  return {
    version: remote.version,
    songs: [...songs.values()],
    vibeCards: [...cards.values()],
    scenarios: [...scenarios.values()],
  };
}

/* ---------------------------- row mapping ---------------------------- */
/* eslint-disable @typescript-eslint/no-explicit-any */

function mapSongRow(row: any): Song | null {
  if (!row?.title || !row?.artist) return null;
  return {
    id: String(row.id),
    title: String(row.title),
    artist: String(row.artist),
    language: String(row.language ?? "english").toLowerCase(),
    region: String(row.region ?? "global").toLowerCase(),
    genres: toStringArray(row.genres),
    era: row.era ? String(row.era) : null,
    platforms: {
      spotifyUrl: row.spotify_url ?? null,
      appleMusicUrl: row.apple_music_url ?? null,
      youtubeMusicUrl: row.youtube_music_url ?? null,
      youtubeVideoId: row.youtube_video_id ?? null,
    },
    traits: (row.traits ?? {}) as TraitScores,
    scenarios: toStringArray(row.scenarios) as ScenarioId[],
    chips: toChips(row.chips),
    popularity: Number(row.popularity_score ?? 0),
  };
}

function mapVibeCardRow(row: any): VibeCardData | null {
  if (!row?.id || !row?.title) return null;
  return {
    id: String(row.id),
    emoji: String(row.emoji ?? "🎵"),
    title: String(row.title),
    subtitle: String(row.subtitle ?? ""),
    traits: (row.traits ?? {}) as TraitScores,
    feedback: String(row.feedback ?? "+ Vibe"),
  };
}

function mapScenarioRow(row: any): Scenario | null {
  if (!row?.id || !row?.label) return null;
  return {
    id: String(row.id) as ScenarioId,
    emoji: String(row.emoji ?? "🎵"),
    label: String(row.label),
    tagline: String(row.tagline ?? ""),
    baseTraits: (row.base_traits ?? {}) as TraitScores,
    deck: toStringArray(row.deck),
  };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function toChips(value: unknown): ReasonChip[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((c: any) => c && typeof c.label === "string")
    .map((c: any) => ({ emoji: String(c.emoji ?? "🎵"), label: c.label }));
}

const isSong = (s: Song | null): s is Song => s !== null;
const isVibeCard = (c: VibeCardData | null): c is VibeCardData => c !== null;
const isScenario = (s: Scenario | null): s is Scenario => s !== null;
