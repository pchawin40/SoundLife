# SoundLife 🎧

**Swipe your vibe. Meet your sound.**

SoundLife is a frictionless music-identity app: pick a moment, swipe a few
vibe cards, get a sound identity ("Gym Villain Arc"), a global tracklist,
artists, playlist names, and a shareable square result card.

No login. No streaming SDKs. No listening-history scraping. The whole
recommendation engine runs client-side; Supabase is an optional, lightweight
layer for catalog freshness and anonymous analytics.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript
npm run test       # Vitest pure-logic tests
npm run lint       # Next lint
npm run build      # static export → ./out
```

The build is a full static export (`output: "export"`), so `./out` deploys to
any static host (Vercel, Netlify, Cloudflare Pages) and is ready to be wrapped
by Capacitor later.

## Environment variables

Copy `.env.example` to `.env.local`. **Everything is optional** — with no env
vars the app builds, runs, and recommends from the bundled catalog.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key — never the service role key |
| `NEXT_PUBLIC_APPLE_AFFILIATE_TOKEN` | Apple Services affiliate token, appended to Apple Music links as `at=`; campaign tracking uses `ct=soundlife` |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` (tables, indexes, RLS).
3. Run `supabase/seed.sql` (starter songs across English, Spanish, Korean,
   Japanese, Hindi, Punjabi, Portuguese, French, Afrobeats/amapiano, Arabic,
   Thai and more, plus vibe cards, scenarios, and the catalog version row).
4. Put the project URL + anon key in `.env.local` and rebuild.

Security model (enforced by RLS in `schema.sql`):

- `songs`, `vibe_cards`, `scenarios`: public **SELECT** of active rows only.
- `catalog_versions`: public **SELECT**.
- `result_events`, `outbound_click_events`: public **INSERT** only — the
  client can log events but never read, update, or delete them.
- No public write access to the catalog at all.

### Publishing catalog updates

Edit rows in the Supabase dashboard (add songs, flip `is_active`, paste
verified platform URLs), then bump the version:

```sql
update catalog_versions set version = version + 1, published_at = now() where id = 'catalog';
```

Clients pick the new catalog up on their next visit. To change the bundled
starter set, edit `lib/catalog.fallback.ts` and regenerate the seed:

```bash
npx tsx scripts/generate-seed.ts
```

### Scheduled iTunes metadata refresh

`scripts/refresh-catalog.ts` can enrich catalog rows with iTunes Search API
metadata: `preview_url`, `artwork_url`, and `itunes_track_id`. It is intended
for CI only and is disabled unless `ENABLE_CATALOG_REFRESH=true`.

Required GitHub secrets for `.github/workflows/refresh-catalog.yml`:

- `ENABLE_CATALOG_REFRESH=true`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is never used in the browser and must never be committed
or exposed with a `NEXT_PUBLIC_` prefix. The script throttles iTunes requests
to under 20/min and stores only returned metadata/URLs. It does not download or
cache audio or artwork.

## How the hybrid catalog works (fallback mode)

```
render instantly ──► bundled fallback catalog (lib/catalog.fallback.ts)
        │
        ├── upgraded by ── localStorage cache (if version > fallback)
        │
        └── revalidated by ── Supabase, in the background:
              1. probe catalog_versions (one tiny row, ≤ every 15 min)
              2. only if newer: fetch active songs/cards/scenarios
              3. merge over fallback, cache, swap into the UI
```

- First paint never waits on the network.
- If Supabase is missing, misconfigured, or down, nothing breaks — the app is
  indistinguishable from fallback mode.
- Payloads stay small: selected columns only, `is_active` filter, 500-row cap,
  no artwork blobs. Artwork and previews are hotlinked provider URLs.
- Analytics inserts are fire-and-forget and never block navigation.

## Platform links (no OAuth, no playback)

SoundLife is deliberately **not** a streaming player. Each song deep-links out
to Spotify / YouTube Music / Apple Music. Verified URLs from the catalog are
used when present; otherwise `lib/platforms.ts` builds search links — we never
invent track IDs. Apple links carry `app=music`, the affiliate token (`at`),
and a campaign (`ct=soundlife`). Outbound taps are logged anonymously.

When a catalog row has `preview_url`, SoundLife can stream that short external
preview after a user taps play. iTunes previews are stream-only, never cached,
and are labeled "provided courtesy of iTunes" near the control.

## Shareable results

Results live at a query-param route (static-export safe, no dynamic segment):

```
/result?s=gym&cards=boxing,spicy-food,dark-rooms&lang=korean
```

The result is recomputed client-side from the URL, so links are free to share
and work offline-ish. "Save / share this card" renders a 1080×1080 PNG via
plain Canvas 2D (no DOM-capture library) and uses the Web Share API with a
download fallback — both Capacitor-friendly.

Share text includes the music identity, emoji trait bars, top songs, and the
same reproducible `/result?...` link. The result screen also creates a
`/match?a=...` handoff link so a friend can add their own result and see aux
compatibility.

## Daily streaks, collection, and match mode

`/daily` uses a deterministic UTC date seed to pick the same Sound of the Day
for everyone. Streaks and discovered identities are stored only in namespaced
localStorage. One missed day pauses the streak; more than one missed day starts
a new streak. Collection rarity is derived deterministically from the top trait
combo and match percentage.

`/match` reads compact encoded result params, recomputes both results
client-side from the catalog, and compares trait vectors. No backend, auth, or
account state is involved.

## Static OG images

`npm run build` runs `npm run generate:og` first. The build-time script writes
scenario and archetype OG PNGs into `public/og/`. Arbitrary per-result OG
images are intentionally approximated by scenario/identity-level images because
the app uses `output: "export"` and cannot render request-time OG images.

## Global Mode

A language/scene filter (Global, English, Spanish, Korean, Japanese, Hindi,
Portuguese, French, Afrobeats, Arabic, Punjabi, Thai) leans the tracklist
toward a language without breaking trait scoring: matching songs rank first
and the global ranking backfills, so results are never empty.

## Recommendation logic (client-side, deterministic)

Vibe cards carry weights across 11 traits. Right-swipes and Super Vibes
accumulate traits on top of the scenario's base traits; rejected cards and
blocked genres shape the penalties. Every catalog song is scored by trait
affinity + scenario bonus + card genre/language/region signals + a small
popularity tiebreaker, then sorted deterministically.

The result identity comes from `lib/archetypes.ts`: 20+ personality-style music
diagnoses with soft, accurate, and roast copy, screenshot-friendly captions,
aux warnings, and visual themes.

## Mobile / Capacitor constraints

- Static export only — no server routes, no SSR-only APIs.
- All Supabase access uses the anon key from the browser; analytics and
  catalog fetches degrade silently offline.
- The share card renders via Canvas, not DOM capture, so it works in a
  WebView.
- No copyrighted audio is stored. External preview URLs are streamed only after
  a user action; artwork URLs are hotlinked and never cached in Supabase
  Storage.

## Project structure

```
app/              layout, page (landing → scenario → swipe), daily/, match/,
                  result/ (shareable results)
components/       LandingPage, ScenarioPicker, GlobalFilter, SwipeDeck, VibeCard,
                  BuildingScreen, ResultsScreen, ShareResultCard, SongCard,
                  TraitBar, PlatformButtons, StreakBadge, CollectionGrid
lib/              types, data (editorial: traits/identities/filters),
                  catalog.fallback (bundled catalog), catalog (SWR + merge),
                  archetypes, daily, streak, storage, match, engine (scoring),
                  platforms (deep links), analytics, audio, haptics,
                  share (text + canvas card), supabaseClient
supabase/         schema.sql (tables + RLS + indexes), seed.sql (generated)
scripts/          generate-seed.ts, generate-og.ts, refresh-catalog.ts
```

## Stack

Next.js 14 (App Router, static export) · React 18 · TypeScript · Tailwind CSS
· Framer Motion · Supabase (optional)
