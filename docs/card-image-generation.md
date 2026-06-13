# Card Image Generation

SoundLife card photos are generated offline with a Node script. They are **not** created during `npm run dev` or `npm run build`, and the OpenAI key never ships to the browser.

## Prerequisites

1. Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

2. Optional: install `sharp` for PNG → JPG conversion when the script falls back to `dall-e-3`:

```bash
npm install
```

`sharp` is an optional dev dependency. If it is missing, `gpt-image-1` JPEG output still works; DALL·E fallback may save PNG bytes with a `.jpg` extension.

## Generate images

```bash
npm run generate:card-images
```

Useful flags:

| Flag | Description |
| --- | --- |
| `--dry-run` | Print jobs and prompts without calling OpenAI |
| `--limit 10` | Generate only the first 10 unique output files |
| `--only no-lyrics-please,tokyo-night-drive` | Filter by output slug or card id |
| `--force` | Regenerate even when the JPG already exists |

Examples:

```bash
# Preview the first 5 jobs
npm run generate:card-images -- --dry-run --limit 5

# Generate two priority assets
npm run generate:card-images -- --only no-lyrics-please,tokyo-night-drive

# Regenerate one card
npm run generate:card-images -- --only gym-villain --force
```

## Output location

Images are written to:

```text
public/images/cards/{output-slug}.jpg
```

Output slugs come from `lib/cardVisualMap.ts` (`imageUrl`), not always the raw card id. For example:

| Card id | Output file |
| --- | --- |
| `no-lyrics` | `no-lyrics-please.jpg` |
| `gym-villain` | `gym-villain-mode.jpg` |
| `tokyo-neon-walk` | `tokyo-night-drive.jpg` |

Shared filenames are generated once and reused by every card that points at the same `imageUrl`.

## Prompt sources

The script merges prompts in this order:

1. `visualPrompt` from `lib/cardVisualMap.ts`
2. Matching row in `docs/card-image-prompts.md`
3. Theme-based fallback derived from `visualTheme`, title, and subtitle

Every prompt is normalized to include:

```text
realistic editorial lifestyle photo, modern consumer music app card, cinematic natural lighting, human-feeling, no text, no logos, no watermark, no distorted faces, no extra fingers
```

## API behavior

1. Tries `gpt-image-1` with `output_format: "jpeg"` and portrait size `1024x1536`
2. Falls back to `dall-e-3` if needed
3. Logs failures per card and continues with the next job
4. Prints `generated`, `skipped`, `failed`, and `output folder` at the end

## Static export safety

- `OPENAI_API_KEY` is read only in `scripts/generate-card-images.ts`
- No `NEXT_PUBLIC_OPENAI_*` variable exists
- `npm run build` does not run image generation automatically

## Recommended first batch

```bash
npm run generate:card-images -- --only no-lyrics-please,tokyo-night-drive,rainy-coffee-shop,gym-villain-mode,soft-beach-sunset,dark-club,acoustic-morning,korean-night-drive,thai-pop-glow,afrobeats-sunshine
```

After images exist, reload the app. Cards use JPG first, then legacy `/vibes/*.png`, then themed gradients.
