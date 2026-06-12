import {
  ARTIST_POOL,
  IDENTITY_RULES,
  SCENARIO_IDENTITY_NOUN,
  SCENARIO_PLAYLISTS,
  SONGS,
  TRAITS,
  TRAIT_META,
  TRAIT_PLAYLISTS,
  VIBE_CARDS,
} from "./data";
import type {
  ResultData,
  Scenario,
  Song,
  Trait,
  TraitScores,
  TraitStat,
  VibeCardData,
} from "./types";

const SCENARIO_SONG_BONUS = 4;
const SCENARIO_ARTIST_BONUS = 2;
const BASE_TRAIT_WEIGHT = 1.5;

/** Build the 7-card deck for a scenario ("Random Me" draws from the full pool). */
export function buildDeck(scenario: Scenario): VibeCardData[] {
  if (scenario.id === "random") {
    const pool = [...VIBE_CARDS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 7);
  }
  const byId = new Map(VIBE_CARDS.map((c) => [c.id, c]));
  return scenario.deck
    .map((id) => byId.get(id))
    .filter((c): c is VibeCardData => Boolean(c));
}

/** The trait that contributes most to a card — used to color its feedback chip. */
export function dominantTrait(traits: TraitScores): Trait {
  let best: Trait = "energy";
  let bestValue = -Infinity;
  for (const trait of TRAITS) {
    const value = traits[trait] ?? 0;
    if (value > bestValue) {
      best = trait;
      bestValue = value;
    }
  }
  return best;
}

function accumulateTraits(scenario: Scenario, liked: VibeCardData[]): Record<Trait, number> {
  const totals = Object.fromEntries(TRAITS.map((t) => [t, 0])) as Record<Trait, number>;
  for (const trait of TRAITS) {
    totals[trait] += (scenario.baseTraits[trait] ?? 0) * BASE_TRAIT_WEIGHT;
  }
  for (const card of liked) {
    for (const trait of TRAITS) {
      totals[trait] += card.traits[trait] ?? 0;
    }
  }
  // Empty state: "Random Me" with zero right-swipes has no signal at all.
  if (TRAITS.every((t) => totals[t] === 0)) {
    totals.energy = 1;
    totals.warmth = 1;
    totals.cinematic = 1;
  }
  return totals;
}

function affinity(traits: TraitScores, normalized: Record<Trait, number>): number {
  let score = 0;
  for (const trait of TRAITS) {
    score += (traits[trait] ?? 0) * normalized[trait];
  }
  return score;
}

function pickIdentity(scenario: Scenario, topTraits: Trait[]): string {
  const topSet = new Set(topTraits);
  for (const rule of IDENTITY_RULES) {
    const scenarioOk = rule.scenarios === "any" || rule.scenarios.includes(scenario.id);
    if (scenarioOk && rule.traits.every((t) => topSet.has(t))) {
      return rule.title;
    }
  }
  const [first, second] = topTraits;
  const adjectives = [TRAIT_META[first].adjective];
  if (second && TRAIT_META[second].adjective !== adjectives[0]) {
    adjectives.push(TRAIT_META[second].adjective);
  }
  return `${adjectives.join(" ")} ${SCENARIO_IDENTITY_NOUN[scenario.id]}`;
}

function pickArtists(topSongs: Song[], normalized: Record<Trait, number>, scenario: Scenario): string[] {
  const fromSongs: string[] = [];
  for (const song of topSongs) {
    if (!fromSongs.includes(song.artist)) fromSongs.push(song.artist);
  }

  const picked = fromSongs.slice(0, 3);
  const fromPool = ARTIST_POOL
    .filter((a) => !picked.includes(a.name))
    .map((a) => ({
      name: a.name,
      score:
        affinity(a.traits, normalized) +
        (a.scenarios.includes(scenario.id) ? SCENARIO_ARTIST_BONUS : 0),
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map((a) => a.name);

  const result = [...picked, ...fromPool, ...fromSongs.slice(3)];
  return [...new Set(result)].slice(0, 5);
}

function pickPlaylists(scenario: Scenario, topTrait: Trait): string[] {
  const [a, b] = SCENARIO_PLAYLISTS[scenario.id];
  return [...new Set([a, b, TRAIT_PLAYLISTS[topTrait]])].slice(0, 3);
}

export function computeResults(scenario: Scenario, liked: VibeCardData[]): ResultData {
  const totals = accumulateTraits(scenario, liked);
  const max = Math.max(...TRAITS.map((t) => totals[t]), 1);
  const normalized = Object.fromEntries(
    TRAITS.map((t) => [t, totals[t] / max])
  ) as Record<Trait, number>;

  const ranked = SONGS
    .map((song) => ({
      song,
      score:
        affinity(song.traits, normalized) +
        (song.scenarios.includes(scenario.id) ? SCENARIO_SONG_BONUS : 0),
    }))
    .sort((a, b) => b.score - a.score || a.song.title.localeCompare(b.song.title));

  const songs = ranked.slice(0, 10).map((r) => r.song);

  const traitStats: TraitStat[] = TRAITS
    .map((trait) => ({ trait, value: totals[trait] }))
    .sort((a, b) => b.value - a.value || TRAITS.indexOf(a.trait) - TRAITS.indexOf(b.trait))
    .slice(0, 5)
    .map(({ trait, value }) => ({
      trait,
      percent: Math.round(15 + 83 * (value / max)),
    }));

  const topTraits = traitStats.slice(0, 3).map((s) => s.trait);
  const secondShare = traitStats[1] ? traitStats[1].percent / 98 : 0.5;
  const matchPercent = Math.min(
    99,
    76 + liked.length * 2 + Math.round(6 * secondShare)
  );

  return {
    identity: pickIdentity(scenario, topTraits),
    matchPercent,
    traits: traitStats,
    songs,
    artists: pickArtists(songs, normalized, scenario),
    playlists: pickPlaylists(scenario, topTraits[0]),
    scenarioId: scenario.id,
    likedCount: liked.length,
  };
}
