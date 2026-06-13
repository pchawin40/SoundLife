# SoundLife Agent Notes

## Project Overview

SoundLife is a Next.js 14 App Router music-identity app. It is a fully static export (`output: "export"`), runs without login, and keeps the recommendation engine client-side and deterministic. Supabase is optional: the browser may use only the anon key for public catalog reads and anonymous insert-only analytics.

Do not add backend routes, Route Handlers, middleware, auth, streaming SDKs, or runtime server dependencies. Keep the bundled fallback catalog authoritative for first paint, and never block initial render on network freshness. Guard all `window`, `navigator`, and `localStorage` access for build/SSR safety.

Catalog RLS model: `songs`, `vibe_cards`, `scenarios`, and `catalog_versions` are public SELECT for active catalog rows. `result_events` and `outbound_click_events` are public INSERT only. Service-role keys are CI-only for catalog refresh scripts and must never use `NEXT_PUBLIC_`.

Share cards stay Canvas 2D based. Web Share API may be used with download/copy fallbacks. Do not store copyrighted audio; previews/artwork are external URLs only, with iTunes preview attribution when used.

## Exact Identifiers To Reuse

Trait keys: `energy`, `darkness`, `tempo`, `softness`, `confidence`, `chaos`, `focus`, `romance`, `cinematic`, `aggression`, `warmth`.

Core types: `Song`, `VibeCardData`, `Scenario`, `Catalog`, `TraitStat`, `ResultData`, `SoundLifeArchetype`, `ResultMatchReason`, `RoastIntensity`, `ShareCardVariant`.

Engine exports: `buildDeck(catalog, scenario, seed?)`, `dominantTrait(traits)`, `getFilter(id)`, `songMatchesFilter(song, filter, region?)`, `computeResults(catalog, scenario, liked, superVibed?, options?)`.

Supabase tables: `songs`, `vibe_cards`, `scenarios`, `catalog_versions`, `result_events`, `outbound_click_events`.

Supabase song columns include `id`, `title`, `artist`, `language`, `region`, `country`, `genres`, `moods`, `era`, `spotify_uri`, `spotify_url`, `apple_music_url`, `youtube_music_url`, `youtube_video_id`, `traits`, `scenarios`, `chips`, `is_active`, `popularity_score`, `explicit`, `energy_level`, `tempo_level`, `lyric_density`, `created_at`, `updated_at`, plus optional `preview_url`, `artwork_url`, `itunes_track_id`.

Analytics signatures: `logResultEvent(input: { result; likedCardIds; region? }): void` and `logOutboundClick(input: { songId?; platform; campaign; resultIdentity? }): void`.

## Commands

- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

Run `npm run typecheck && npm run test && npm run build` before finishing; do not modify tests to make them pass.
