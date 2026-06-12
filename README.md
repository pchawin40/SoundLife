# SoundLife 🎧

**Swipe your vibe. Get the perfect soundtrack for your day.**

SoundLife creates a soundtrack for every part of your day. Pick a scenario,
swipe through a few lifestyle/vibe cards, and get a real-music recommendation
profile — songs, artists, playlist names, and one-tap platform search links.

No account. No listening history. No backend. Just your vibe.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Deploys to Vercel with zero configuration
(`vercel` or import the repo — it's a standard Next.js App Router project).

## How it works

1. **Landing** → tap "Find my sound"
2. **Scenario** → pick a moment (Drive, Gym, Focus, Party, Sad, Chill, Random Me)
3. **Swipe** → 7 vibe cards; swipe right for "Vibe", left for "Not me"
   (drag, buttons, or arrow keys)
4. **Results** → a sound identity ("Gym Villain Arc"), match %, trait bars,
   10 real songs with "why it matched" chips, 5 artists, 3 playlist names,
   and search buttons for Spotify / YouTube Music / Apple Music
5. **Share** → "Copy my SoundLife" copies a text summary; the hero card is
   designed to be screenshot-worthy

## Recommendation logic (no AI, no APIs)

Every vibe card carries trait weights across 11 traits (energy, darkness,
tempo, softness, confidence, chaos, focus, romance, cinematic, aggression,
warmth). Right-swipes accumulate traits on top of the scenario's base traits.
Each song in the static catalog is scored by trait affinity plus a scenario
bonus, sorted, and the top 10 are returned. The identity name comes from a
rule table keyed on scenario + top traits, with a compositional fallback.

## Project structure

```
app/            layout, page (state machine), global styles
components/     LandingPage, ScenarioPicker, SwipeDeck, VibeCard,
                BuildingScreen, ResultsScreen, ShareCard, SongCard,
                TraitBar, PlatformButtons
lib/            types.ts, data.ts (static catalog), engine.ts (scoring),
                share.ts (clipboard + platform URLs)
```

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion
# SoundLife
