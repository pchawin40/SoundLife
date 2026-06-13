# Card Image Generation

SoundLife card art is generated offline with a Node script. Images are **not** created during `npm run dev` or `npm run build`, and the OpenAI key never ships to the browser.

Default style is **editorial-photo**: realistic editorial lifestyle photography with a candid documentary feel, atmospheric scenes, natural imperfect lighting, subtle film grain, and playlist-cover composition.

## Prerequisites

1. Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

The script loads Next-style env files automatically with `@next/env`, including `.env.local` and `.env`. A normal shell export still works too:

```bash
export OPENAI_API_KEY="sk-..."
```

Keep this server/script-only. Do not use `NEXT_PUBLIC_OPENAI_API_KEY`.

2. Install dependencies:

```bash
npm install
```

## Generate images

```bash
npm run generate:card-images
```

This defaults to `--style editorial-photo`.

Run the image audit any time mappings or assets change:

```bash
npm run audit:card-images
```

### Style modes

| Style | Use when |
| --- | --- |
| `editorial-photo` (default) | Realistic editorial scene photography, least AI-looking |
| `realistic` | Alias-style photo mode using the same safer editorial rules |
| `editorial` | Alias-style photo mode using the same safer editorial rules |
| `elephant` | Deprecated/experimental mascot illustration mode |
| `cartoon` | Deprecated generic cartoon illustration prompts |

### Useful flags

| Flag | Description |
| --- | --- |
| `--style editorial-photo` | Editorial photo prompts (default) |
| `--style realistic` | Photo prompts with the same anti-AI safety suffix |
| `--style elephant` | Deprecated elephant mascot prompts |
| `--dry-run` | Print jobs and prompts without calling OpenAI |
| `--limit 10` | Generate only the first 10 card image jobs |
| `--only no-lyrics,tokyo-neon-walk` | Filter by card id or output slug |
| `--force` | Overwrite existing JPGs |
| `--unique-per-card` | Generate one output file per card id (default) |
| `--dedupe` | Legacy mode: share output files when cards map to the same image path |

### Examples

```bash
# Preview editorial-photo prompts
npm run generate:card-images -- --style editorial-photo --limit 10

# Regenerate selected editorial-photo assets
npm run generate:card-images -- --style editorial-photo --only no-lyrics,tokyo-neon-walk --force

# Regenerate one bad image
npm run generate:card-images -- --style editorial-photo --only card-id-or-output-slug --force

# Generate missing editorial-photo JPGs
npm run generate:card-images -- --style editorial-photo

# Regenerate one bad or blurry card from scratch
rm public/images/cards/road-trip.jpg
npm run generate:card-images -- --style editorial-photo --only road-trip --force
```

## Output location

Images are written to:

```text
public/images/cards/{output-slug}.jpg
```

Output slugs come from `lib/cardVisualMap.ts` (`imageUrl`). By default, every card maps to its own card-id filename:

| Card id | Output file |
| --- | --- |
| `no-lyrics` | `no-lyrics.jpg` |
| `gym-villain` | `gym-villain.jpg` |
| `tokyo-neon-walk` | `tokyo-neon-walk.jpg` |

Each card should normally map to its own generated JPG at `/images/cards/{card-id}.jpg`. Shared filenames are deprecated and should only be used intentionally with `--dedupe`.

Existing images are skipped unless you pass `--force`.

## Prompt sources

The script merges prompts in this order:

**Editorial-photo / realistic / editorial**

1. Matching row in `docs/card-image-prompts.md`
2. `visualPrompt` from `lib/cardVisualMap.ts`
3. Theme-based editorial-photo fallback from `visualTheme`, title, and subtitle

**Elephant / cartoon**

Deprecated illustration modes still work when explicitly requested, but are no longer the default.

## Audit Expectations

`npm run audit:card-images` reports:

- duplicate image mappings
- missing generated JPG files
- cards using legacy `/vibes/*.png`
- cards using generated `/images/cards/*.jpg`
- existing generated JPG files
- cards with no `imageUrl`
- image dimensions and file size when available

After changing mappings to unique per-card paths, missing files are expected until you regenerate the editorial-photo JPGs.

### Editorial-photo base prompt

```text
realistic editorial lifestyle photograph for a music discovery app, candid documentary feel, atmospheric scene, natural imperfect lighting, subtle film grain, playlist-cover composition, no text, no logos, no watermark, no celebrity, no album art, no close-up face, no distorted hands, no extra fingers, not overly polished, not glossy AI stock photo
```

Composition rules:

- Prefer back-facing people, silhouettes, cropped figures, or no people.
- Prefer environments and objects over faces.
- Avoid fake influencer/model portraits.
- Avoid direct face closeups and detailed hands.
- Do not use copyrighted album art, artist imagery, or identifiable celebrity faces.
- Make the image feel like a playlist cover or film still.

## Quality review

Review generated images before committing them. Reject images with fake-looking faces, weird hands, extra limbs, text, logos, watermarks, celebrity resemblance, album art, copyrighted artist imagery, or a glossy AI stock-photo look.

To retry a bad image, delete the bad JPG or overwrite it with `--force`:

```bash
npm run generate:card-images -- --style editorial-photo --only card-id-or-output-slug --force
```

## API behavior

1. Tries `gpt-image-1` with `output_format: "jpeg"` and portrait size `1024x1536`
2. Falls back to `dall-e-3` if needed
3. Logs failures per card and continues with the next job
4. Prints `generated`, `skipped`, `failed`, and `output folder` at the end

## Static export safety

- `OPENAI_API_KEY` is read only in `scripts/generate-card-images.ts`
- `.env.local`, `.env`, and existing shell environment variables are loaded before generation
- No `NEXT_PUBLIC_OPENAI_*` variable exists
- `npm run build` does not run image generation automatically

After images exist, reload the app. Cards use JPG first, then legacy `/vibes/*.png`, then themed gradients.
