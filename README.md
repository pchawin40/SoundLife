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
3. Run `supabase/seed.sql` (68 starter songs across English, Spanish, Korean,
   Japanese, Hindi, Punjabi, Portuguese, French, Afrobeats/amapiano, Arabic,
   Thai and more, plus vibe cards, scenarios, and catalog version 2).
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
  no artwork blobs.
- Analytics inserts are fire-and-forget and never block navigation.

## Platform links (no OAuth, no playback)

SoundLife is deliberately **not** a streaming player. Each song deep-links out
to Spotify / YouTube Music / Apple Music. Verified URLs from the catalog are
used when present; otherwise `lib/platforms.ts` builds search links — we never
invent track IDs. Apple links carry `app=music`, the affiliate token (`at`),
and a campaign (`ct=soundlife`). Outbound taps are logged anonymously.

## Shareable results

Results live at a query-param route (static-export safe, no dynamic segment):

```
/result?s=gym&cards=boxing,spicy-food,dark-rooms&lang=korean
```

The result is recomputed client-side from the URL, so links are free to share
and work offline-ish. "Save / share this card" renders a 1080×1080 PNG via
plain Canvas 2D (no DOM-capture library) and uses the Web Share API with a
download fallback — both Capacitor-friendly.

## Global Mode

A language/scene filter (Global, English, Spanish, Korean, Japanese, Hindi,
Portuguese, French, Afrobeats, Arabic, Punjabi, Thai) leans the tracklist
toward a language without breaking trait scoring: matching songs rank first
and the global ranking backfills, so results are never empty.

## Recommendation logic (client-side, deterministic)

Vibe cards carry weights across 11 traits. Right-swipes accumulate traits on
top of the scenario's base traits; every catalog song is scored by trait
affinity + a scenario bonus + a small popularity tiebreaker, then sorted
deterministically. Identity names come from a rule table keyed on
scenario + top traits with a compositional fallback.

## Mobile / Capacitor constraints

- Static export only — no server routes, no SSR-only APIs.
- All Supabase access uses the anon key from the browser; analytics and
  catalog fetches degrade silently offline.
- The share card renders via Canvas, not DOM capture, so it works in a
  WebView.
- No copyrighted audio is stored or played; no artwork is fetched from
  Supabase Storage.

## Project structure

```
app/              layout, page (landing → scenario → swipe), result/ (shareable results)
components/       LandingPage, ScenarioPicker, GlobalFilter, SwipeDeck, VibeCard,
                  BuildingScreen, ResultsScreen, ShareResultCard, SongCard,
                  TraitBar, PlatformButtons
lib/              types, data (editorial: traits/identities/filters),
                  catalog.fallback (bundled catalog), catalog (SWR + merge),
                  engine (scoring), platforms (deep links), analytics,
                  share (text + canvas card), supabaseClient
supabase/         schema.sql (tables + RLS + indexes), seed.sql (generated)
scripts/          generate-seed.ts (fallback catalog → seed.sql)
```

## Stack

Next.js 14 (App Router, static export) · React 18 · TypeScript · Tailwind CSS
· Framer Motion · Supabase (optional)
