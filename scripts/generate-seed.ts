/**
 * Regenerates supabase/seed.sql from the bundled fallback catalog so the
 * remote starter data never drifts from the local one.
 *
 *   npx tsx scripts/generate-seed.ts
 *
 * Platform URLs are emitted as search links (never invented track IDs);
 * replace them with verified URLs in the Supabase dashboard over time.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  FALLBACK_CATALOG_VERSION,
  FALLBACK_SCENARIOS,
  FALLBACK_SONGS,
  FALLBACK_VIBE_CARDS,
} from "../lib/catalog.fallback";
import type { Song } from "../lib/types";

const SEED_VERSION = FALLBACK_CATALOG_VERSION + 1;

const q = (value: string): string => `'${value.replace(/'/g, "''")}'`;
const jsonb = (value: unknown): string => `${q(JSON.stringify(value))}::jsonb`;
const textArray = (values: string[]): string =>
  values.length === 0
    ? "'{}'::text[]"
    : `array[${values.map(q).join(", ")}]::text[]`;

const query = (song: Song) => encodeURIComponent(`${song.title} ${song.artist}`);
const spotifySearch = (song: Song) =>
  song.platforms.spotifyUrl ?? `https://open.spotify.com/search/${query(song)}`;
const appleSearch = (song: Song) =>
  song.platforms.appleMusicUrl ??
  `https://music.apple.com/us/search?term=${query(song)}`;
const ytmSearch = (song: Song) =>
  song.platforms.youtubeMusicUrl ??
  `https://music.youtube.com/search?q=${query(song)}`;

const lines: string[] = [
  "-- SoundLife — starter catalog seed (generated, do not edit by hand)",
  "-- Regenerate with: npx tsx scripts/generate-seed.ts",
  "-- Idempotent: songs upsert on (lower(title), lower(artist)), the rest on id.",
  "",
  "begin;",
  "",
  "/* vibe cards */",
];

for (const card of FALLBACK_VIBE_CARDS) {
  lines.push(
    `insert into public.vibe_cards (id, emoji, title, subtitle, traits, feedback, is_active) values (` +
      [
        q(card.id),
        q(card.emoji),
        q(card.title),
        q(card.subtitle),
        jsonb(card.traits),
        q(card.feedback),
        "true",
      ].join(", ") +
      `) on conflict (id) do update set emoji = excluded.emoji, title = excluded.title, subtitle = excluded.subtitle, traits = excluded.traits, feedback = excluded.feedback, is_active = true;`
  );
}

lines.push("", "/* scenarios */");
for (const scenario of FALLBACK_SCENARIOS) {
  lines.push(
    `insert into public.scenarios (id, emoji, label, tagline, base_traits, deck, is_active) values (` +
      [
        q(scenario.id),
        q(scenario.emoji),
        q(scenario.label),
        q(scenario.tagline),
        jsonb(scenario.baseTraits),
        textArray(scenario.deck),
        "true",
      ].join(", ") +
      `) on conflict (id) do update set emoji = excluded.emoji, label = excluded.label, tagline = excluded.tagline, base_traits = excluded.base_traits, deck = excluded.deck, is_active = true;`
  );
}

lines.push("", "/* songs */");
for (const song of FALLBACK_SONGS) {
  lines.push(
    `insert into public.songs (title, artist, language, region, genres, era, spotify_url, apple_music_url, youtube_music_url, youtube_video_id, traits, scenarios, chips, popularity_score) values (` +
      [
        q(song.title),
        q(song.artist),
        q(song.language),
        q(song.region),
        textArray(song.genres),
        song.era ? q(song.era) : "null",
        q(spotifySearch(song)),
        q(appleSearch(song)),
        q(ytmSearch(song)),
        song.platforms.youtubeVideoId ? q(song.platforms.youtubeVideoId) : "null",
        jsonb(song.traits),
        textArray(song.scenarios),
        jsonb(song.chips),
        String(song.popularity ?? 0),
      ].join(", ") +
      `) on conflict ((lower(title)), (lower(artist))) do nothing;`
  );
}

lines.push(
  "",
  "/* publish */",
  `insert into public.catalog_versions (id, version) values ('catalog', ${SEED_VERSION})` +
    ` on conflict (id) do update set version = greatest(public.catalog_versions.version, excluded.version), published_at = now();`,
  "",
  "commit;",
  ""
);

const outPath = join(__dirname, "..", "supabase", "seed.sql");
writeFileSync(outPath, lines.join("\n"));
console.log(
  `Wrote ${outPath}: ${FALLBACK_SONGS.length} songs, ${FALLBACK_VIBE_CARDS.length} vibe cards, ${FALLBACK_SCENARIOS.length} scenarios, version ${SEED_VERSION}`
);
