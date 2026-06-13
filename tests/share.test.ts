import { describe, expect, it } from "vitest";
import { SOUNDLIFE_ARCHETYPES } from "@/lib/archetypes";
import { buildShareText } from "@/lib/share";
import type { ResultData } from "@/lib/types";

const result: ResultData = {
  identity: "Gym Villain Arc",
  archetype: SOUNDLIFE_ARCHETYPES[0],
  roastIntensity: "accurate",
  resultCopy: SOUNDLIFE_ARCHETYPES[0].accurateCopy,
  whyMatched: {
    vibedWith: ["🥊 Boxing", "🔊 Heavy bass"],
    rejected: "No cowboy sadness.",
    strongestSignal: "Aggression did most of the fingerprints.",
    strongestSignalType: "trait",
  },
  vibeTags: ["Aggression", "Energy", "Hip Hop"],
  matchPercent: 94,
  traits: [
    { trait: "aggression", percent: 98 },
    { trait: "confidence", percent: 91 },
    { trait: "energy", percent: 88 },
  ],
  songs: [
    {
      id: "one",
      title: "POWER",
      artist: "Kanye West",
      language: "english",
      region: "north-america",
      genres: ["hip-hop"],
      platforms: {},
      traits: { confidence: 3 },
      scenarios: ["gym"],
      chips: [],
    },
  ],
  artists: ["Run The Jewels"],
  playlists: ["one more rep"],
  scenarioId: "gym",
  likedCount: 2,
  superVibeCount: 1,
  filterId: "global",
};

describe("share text", () => {
  it("includes the identity, trait bars, songs, and reproducible link", () => {
    const text = buildShareText(result, "https://soundlife.app/result?s=gym&cards=boxing");
    expect(text).toContain("Gym Villain Arc");
    expect(text).toContain("🟩");
    expect(text).toContain("POWER - Kanye West");
    expect(text).toContain("https://soundlife.app/result?s=gym&cards=boxing");
  });
});
