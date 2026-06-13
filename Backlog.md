# SoundLife Backlog

## Phase 0 - Tooling And Orientation

- [x] Read project constraints and exact identifiers.
- [x] Add `AGENTS.md`.
- [x] Add Vitest and script scaffolding.
- [x] Run typecheck, tests, lint, and static build.

## Phase 1 - Daily Prompt, Streaks, Collection

- [x] Add deterministic daily prompt helper.
- [x] Add SSR-safe namespaced storage helpers.
- [x] Add pure streak and collection math with grace-day rule.
- [x] Wire streak badge and collection grid into landing/results.
- [x] Add `/daily`.

## Phase 2 - Shareability

- [x] Add reproducible-link share text with emoji trait bars.
- [x] Add copy result CTA beside share card flow.

## Phase 3 - Friend Match

- [x] Add deterministic match pure logic.
- [x] Add `/match` static client page.
- [x] Add compare CTA and URL handoff.

## Phase 4 - Static OG Images

- [x] Generate scenario and archetype OG PNGs at build time.
- [x] Add static route metadata and README notes.

## Phase 5 - Dynamic Catalog Refresh

- [x] Add optional iTunes preview/artwork columns.
- [x] Add CI-only catalog refresh script and workflow.
- [x] Keep service-role key out of client/public env.

## Phase 6 - Audio Preview And Swipe UX

- [x] Add shared audio manager.
- [x] Add preview controls where `preview_url` exists with iTunes attribution.
- [x] Add haptics wrapper and swipe commit integration.
- [x] Preserve swipe transition guard and undo support.

## Constraint Notes

- Arbitrary per-result OG images cannot be generated at request time with `output: "export"`. Use scenario/archetype-level approximations generated during `prebuild`.
- Vibe cards do not currently carry track-level `preview_url`; audio previews can only appear where a `Song` is present unless the catalog later adds card preview metadata.
- YouTube playlist creation remains backlog. It requires Google OAuth, YouTube Data API `playlists.insert` and `playlistItems.insert`, plus either `youtube_video_id` for every song or a conservative search/matching step.
- YouTube Music playlist creation is not as clean as Spotify playlist creation. Build and harden Spotify first, then decide whether YouTube Data API export is worth the OAuth/API complexity.
