import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import React from "react";
import { ImageResponse } from "@vercel/og";
import { SOUNDLIFE_ARCHETYPES } from "../lib/archetypes";
import { FALLBACK_SCENARIOS } from "../lib/catalog.fallback";

const OUT_DIR = join(process.cwd(), "public", "og");
const WIDTH = 1200;
const HEIGHT = 630;

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function renderPng(element: React.ReactElement, filename: string): Promise<void> {
  const response = new ImageResponse(element, { width: WIDTH, height: HEIGHT });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(join(OUT_DIR, filename), buffer);
}

function frame(input: {
  eyebrow: string;
  title: string;
  subtitle: string;
  emoji: string;
  accent: string;
  background: string;
}): React.ReactElement {
  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: input.background,
        color: "#fff7ed",
        fontFamily: "Inter, Arial, sans-serif",
      },
    },
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.62)",
          },
        },
        "SOUNDLIFE"
      ),
      React.createElement("div", { style: { fontSize: 76 } }, input.emoji)
    ),
    React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 22 } },
      React.createElement(
        "div",
        {
          style: {
            alignSelf: "flex-start",
            border: `2px solid ${input.accent}`,
            borderRadius: 999,
            padding: "10px 22px",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: 3,
            color: input.accent,
            background: "rgba(255,255,255,0.08)",
          },
        },
        input.eyebrow.toUpperCase()
      ),
      React.createElement(
        "div",
        {
          style: {
            maxWidth: 880,
            fontSize: input.title.length > 24 ? 76 : 88,
            lineHeight: 0.92,
            fontWeight: 900,
            letterSpacing: -2,
          },
        },
        input.title
      ),
      React.createElement(
        "div",
        {
          style: {
            maxWidth: 760,
            fontSize: 32,
            lineHeight: 1.25,
            fontWeight: 700,
            color: "rgba(255,255,255,0.72)",
          },
        },
        input.subtitle
      )
    ),
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${input.accent}, rgba(255,255,255,0.24))`,
        },
      }
    )
  );
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });

  for (const scenario of FALLBACK_SCENARIOS) {
    await renderPng(
      frame({
        eyebrow: "Sound scene",
        title: scenario.label,
        subtitle: scenario.tagline,
        emoji: scenario.emoji,
        accent: "#2DD4BF",
        background: "linear-gradient(135deg, #111827 0%, #0f766e 48%, #f59e0b 100%)",
      }),
      `scenario-${slug(scenario.id)}.png`
    );
  }

  for (const archetype of SOUNDLIFE_ARCHETYPES) {
    await renderPng(
      frame({
        eyebrow: "Music identity",
        title: archetype.name,
        subtitle: archetype.diagnosis,
        emoji: archetype.emoji,
        accent: archetype.colorTheme.accent,
        background: `linear-gradient(135deg, ${archetype.colorTheme.background} 0%, #111827 62%, ${archetype.colorTheme.accent} 100%)`,
      }),
      `identity-${slug(archetype.id)}.png`
    );
  }

  console.log(
    `Generated ${FALLBACK_SCENARIOS.length + SOUNDLIFE_ARCHETYPES.length} OG images in public/og`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
