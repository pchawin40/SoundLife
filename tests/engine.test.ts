import { describe, expect, it } from "vitest";
import { FALLBACK_CATALOG } from "@/lib/catalog.fallback";
import { computeResults } from "@/lib/engine";
import type { Catalog, Scenario, Song, VibeCardData } from "@/lib/types";

function scenario(id: Scenario["id"]): Scenario {
  const match = FALLBACK_CATALOG.scenarios.find((item) => item.id === id);
  if (!match) throw new Error(`Missing scenario ${id}`);
  return match;
}

function card(id: string): VibeCardData {
  const match = FALLBACK_CATALOG.vibeCards.find((item) => item.id === id);
  if (!match) throw new Error(`Missing card ${id}`);
  return match;
}

function songIds(songs: Song[]): string[] {
  return songs.map((song) => song.id);
}

function countByLanguage(songs: Song[], language: string): number {
  return songs.filter((song) => song.language === language).length;
}

describe("recommendation engine", () => {
  it("makes meaningfully different playlists for different swipe signals", () => {
    const gymResult = computeResults(
      FALLBACK_CATALOG,
      scenario("gym"),
      [card("boxing"), card("heavy-bass"), card("illegal-gym-music")]
    );
    const softResult = computeResults(
      FALLBACK_CATALOG,
      scenario("chill"),
      [card("coffee-shop"), card("lo-fi-beats"), card("french-cafe")]
    );

    const sharedSongs = songIds(gymResult.songs).filter((id) => songIds(softResult.songs).includes(id));
    expect(sharedSongs.length).toBeLessThanOrEqual(3);
    expect(gymResult.identity).not.toBe(softResult.identity);
  });

  it("removes a blocked genre when enough alternatives exist", () => {
    const result = computeResults(
      FALLBACK_CATALOG,
      scenario("chill"),
      [card("country-respect-heartbreak"), card("indie-folk")]
    );

    expect(result.songs).toHaveLength(10);
    expect(result.songs.every((song) => !song.genres.includes("country"))).toBe(true);
    expect(result.whyMatched.avoided).toContain("Country");
  });

  it("avoids duplicate artists when the catalog has enough alternatives", () => {
    const result = computeResults(
      FALLBACK_CATALOG,
      scenario("party"),
      [card("foreign-language-feelings"), card("bass-over-lyrics"), card("dance-floor")]
    );
    const artists = result.songs.map((song) => song.artist);

    expect(new Set(artists).size).toBe(artists.length);
  });

  it("boosts Japanese songs when Japanese is selected", () => {
    const liked = [card("tokyo-neon-walk")];
    const globalResult = computeResults(FALLBACK_CATALOG, scenario("drive"), liked, [], {
      filterId: "global",
    });
    const japaneseResult = computeResults(FALLBACK_CATALOG, scenario("drive"), liked, [], {
      filterId: "japanese",
    });

    expect(countByLanguage(japaneseResult.songs, "japanese")).toBeGreaterThan(
      countByLanguage(globalResult.songs, "japanese")
    );
    expect(countByLanguage(japaneseResult.songs, "japanese")).toBeGreaterThanOrEqual(5);
  });

  it("keeps global mode globally varied instead of all English hits", () => {
    const result = computeResults(
      FALLBACK_CATALOG,
      scenario("party"),
      [card("foreign-language-feelings"), card("latin-party"), card("kpop-energy")],
      [],
      { filterId: "global" }
    );
    const languages = new Set(result.songs.map((song) => song.language));
    const nonEnglishCount = result.songs.filter((song) => song.language !== "english").length;

    expect(languages.size).toBeGreaterThanOrEqual(4);
    expect(nonEnglishCount).toBeGreaterThanOrEqual(5);
  });

  it("does not let popularity overpower trait matching", () => {
    const testScenario: Scenario = {
      id: "gym",
      emoji: "🏋️",
      label: "Gym",
      tagline: "Test",
      baseTraits: { aggression: 1, energy: 1 },
      deck: [],
    };
    const likedCard: VibeCardData = {
      id: "test-aggression",
      emoji: "🥊",
      title: "Aggressive focus",
      subtitle: "Trait fit",
      traits: { aggression: 3, energy: 2, focus: 1 },
      feedback: "+ Aggression",
      boostGenres: ["hip-hop"],
    };
    const catalog: Catalog = {
      version: 1,
      vibeCards: [likedCard],
      scenarios: [testScenario],
      songs: [
        {
          id: "trait-fit",
          title: "Low Popularity Perfect Fit",
          artist: "Precise Artist",
          language: "english",
          region: "north-america",
          genres: ["hip-hop"],
          platforms: {},
          traits: { aggression: 3, energy: 3, focus: 1 },
          scenarios: ["gym"],
          chips: [],
          popularity: 12,
        },
        {
          id: "popular-miss",
          title: "High Popularity Wrong Fit",
          artist: "Popular Artist",
          language: "english",
          region: "north-america",
          genres: ["pop"],
          platforms: {},
          traits: { softness: 3, warmth: 3 },
          scenarios: ["gym"],
          chips: [],
          popularity: 100,
        },
      ],
    };

    const result = computeResults(catalog, testScenario, [likedCard]);
    expect(result.songs[0].id).toBe("trait-fit");
    expect(result.scoreDebug?.find((row) => row.songId === "popular-miss")?.popularityBonus).toBeLessThan(1);
  });
});
