import {
  ARTIST_POOL,
  GLOBAL_FILTERS,
  SCENARIO_PLAYLISTS,
  TRAITS,
  TRAIT_META,
  TRAIT_PLAYLISTS,
} from "./data";
import { SOUNDLIFE_ARCHETYPES } from "./archetypes";
import type {
  Catalog,
  FilterId,
  GlobalFilterOption,
  ResultMatchReason,
  ResultData,
  RoastIntensity,
  Scenario,
  SoundLifeArchetype,
  Song,
  Trait,
  TraitScores,
  TraitStat,
  VibeCardData,
} from "./types";

const SCENARIO_SONG_BONUS = 4;
const SCENARIO_ARTIST_BONUS = 2;
const BASE_TRAIT_WEIGHT = 1.5;
const SUPER_VIBE_MULTIPLIER = 2.2;
/** Deterministic nudge so equal-affinity songs rank by popularity. */
const POPULARITY_WEIGHT = 0.01;
/** Boost for songs whose genres/languages match liked cards. */
const GENRE_BOOST = 3;
/** Penalty for songs whose genres are blocked via antiGenre cards. */
const GENRE_BLOCK_PENALTY = -12;
/** Small penalty for songs that resemble cards the user actively rejected. */
const REJECTED_PREFERENCE_PENALTY = -3;
const RESULT_SONG_COUNT = 10;

/* ----------------------------- deck ----------------------------- */

/** Build the deck for a scenario ("Random Me" draws from the full pool). */
export function buildDeck(catalog: Catalog, scenario: Scenario): VibeCardData[] {
  if (scenario.deck.length === 0) {
    const pool = [...catalog.vibeCards];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 12);
  }
  const byId = new Map(catalog.vibeCards.map((c) => [c.id, c]));
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

/* ---------------------------- filters ---------------------------- */

export function getFilter(id: FilterId | string | null | undefined): GlobalFilterOption {
  return GLOBAL_FILTERS.find((f) => f.id === id) ?? GLOBAL_FILTERS[0];
}

export function songMatchesFilter(
  song: Song,
  filter: GlobalFilterOption,
  region?: string | null
): boolean {
  if (region && song.region !== region.toLowerCase()) return false;
  if (filter.id === "global") return true;
  if (filter.languages?.includes(song.language)) return true;
  if (filter.genres?.some((g) => song.genres.includes(g))) return true;
  if (filter.regions?.includes(song.region)) return true;
  return false;
}

/* ---------------------------- scoring ---------------------------- */

function accumulateTraits(
  scenario: Scenario,
  liked: VibeCardData[],
  superVibed: VibeCardData[]
): Record<Trait, number> {
  const totals = Object.fromEntries(TRAITS.map((t) => [t, 0])) as Record<Trait, number>;
  for (const trait of TRAITS) {
    totals[trait] += (scenario.baseTraits[trait] ?? 0) * BASE_TRAIT_WEIGHT;
  }
  for (const card of liked) {
    const mult = superVibed.some((s) => s.id === card.id) ? SUPER_VIBE_MULTIPLIER : 1;
    for (const trait of TRAITS) {
      totals[trait] += (card.traits[trait] ?? 0) * mult;
    }
  }
  if (TRAITS.every((t) => totals[t] === 0)) {
    totals.energy = 1;
    totals.warmth = 1;
    totals.cinematic = 1;
  }
  return totals;
}

/** Build sets of genre/language/region preferences from typed liked cards. */
function buildPreferences(
  liked: VibeCardData[],
  disliked: VibeCardData[] = []
): {
  boostedGenres: Set<string>;
  blockedGenres: Set<string>;
  boostedLanguages: Set<string>;
  boostedRegions: Set<string>;
  rejectedGenres: Set<string>;
  rejectedLanguages: Set<string>;
  rejectedRegions: Set<string>;
  rejectedBlockedGenres: Set<string>;
} {
  const boostedGenres = new Set<string>();
  const blockedGenres = new Set<string>();
  const boostedLanguages = new Set<string>();
  const boostedRegions = new Set<string>();
  const rejectedGenres = new Set<string>();
  const rejectedLanguages = new Set<string>();
  const rejectedRegions = new Set<string>();
  const rejectedBlockedGenres = new Set<string>();

  for (const card of liked) {
    card.boostGenres?.forEach((g) => boostedGenres.add(g));
    card.blockGenres?.forEach((g) => blockedGenres.add(g));
    card.boostLanguages?.forEach((l) => boostedLanguages.add(l));
    card.boostRegions?.forEach((r) => boostedRegions.add(r));
  }
  for (const card of disliked) {
    card.boostGenres?.forEach((g) => rejectedGenres.add(g));
    card.boostLanguages?.forEach((l) => rejectedLanguages.add(l));
    card.boostRegions?.forEach((r) => rejectedRegions.add(r));
    card.blockGenres?.forEach((g) => rejectedBlockedGenres.add(g));
  }
  return {
    boostedGenres,
    blockedGenres,
    boostedLanguages,
    boostedRegions,
    rejectedGenres,
    rejectedLanguages,
    rejectedRegions,
    rejectedBlockedGenres,
  };
}

function affinity(traits: TraitScores, normalized: Record<Trait, number>): number {
  let score = 0;
  for (const trait of TRAITS) {
    score += (traits[trait] ?? 0) * normalized[trait];
  }
  return score;
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
  const [a, b] = SCENARIO_PLAYLISTS[scenario.id] ?? SCENARIO_PLAYLISTS.random;
  return [...new Set([a, b, TRAIT_PLAYLISTS[topTrait]])].slice(0, 3);
}

/* ---------------------------- results ---------------------------- */

export interface ResultOptions {
  filterId?: FilterId;
  region?: string | null;
  disliked?: VibeCardData[];
  roastIntensity?: RoastIntensity;
}

interface ArchetypeMatch {
  archetype: SoundLifeArchetype;
  score: number;
}

interface PreferenceSignals {
  boostedGenres: Set<string>;
  blockedGenres: Set<string>;
  boostedLanguages: Set<string>;
  boostedRegions: Set<string>;
  rejectedGenres: Set<string>;
  rejectedLanguages: Set<string>;
  rejectedRegions: Set<string>;
  rejectedBlockedGenres: Set<string>;
}

function hasOverlap(values: Set<string>, desired: string[]): boolean {
  return desired.some((value) => values.has(value));
}

function intersectionCount(values: Set<string>, desired: string[]): number {
  let count = 0;
  for (const value of desired) {
    if (values.has(value)) count += 1;
  }
  return count;
}

function cardArchetypeSignal(card: VibeCardData, archetype: SoundLifeArchetype): number {
  let score = 0;
  for (const trait of archetype.requiredTraits) {
    score += (card.traits[trait] ?? 0) * 1.7;
  }
  if (card.boostGenres?.some((genre) => archetype.preferredGenres.includes(genre))) score += 4;
  if (card.boostLanguages?.some((lang) => archetype.preferredLanguages.includes(lang))) score += 4;
  if (card.blockGenres?.some((genre) => archetype.blockedGenres.includes(genre))) score += 3;
  return score;
}

function matchArchetype(input: {
  scenario: Scenario;
  topTraits: Trait[];
  normalized: Record<Trait, number>;
  liked: VibeCardData[];
  superVibed: VibeCardData[];
  disliked: VibeCardData[];
  preferences: PreferenceSignals;
  filter: GlobalFilterOption;
}): ArchetypeMatch {
  const {
    scenario,
    topTraits,
    normalized,
    liked,
    superVibed,
    disliked,
    preferences,
    filter,
  } = input;
  const topTraitSet = new Set(topTraits);
  const languageSignals = new Set([
    ...(filter.languages ?? []),
    ...preferences.boostedLanguages,
  ]);
  const genreSignals = new Set([...(filter.genres ?? []), ...preferences.boostedGenres]);
  const regionSignals = new Set([...(filter.regions ?? []), ...preferences.boostedRegions]);
  const superIds = new Set(superVibed.map((card) => card.id));

  const scored = SOUNDLIFE_ARCHETYPES.map((archetype, index) => {
    let score = 0;

    for (const trait of archetype.requiredTraits) {
      score += (normalized[trait] ?? 0) * 8;
      score += topTraitSet.has(trait) ? 10 : -3;
    }

    if (archetype.preferredScenarios.includes(scenario.id)) {
      score += 13;
    } else if (archetype.preferredScenarios.length >= 6) {
      score += 3;
    } else {
      score -= 4;
    }

    score += intersectionCount(genreSignals, archetype.preferredGenres) * 7;
    score += intersectionCount(languageSignals, archetype.preferredLanguages) * 7;
    score += hasOverlap(regionSignals, archetype.preferredGenres) ? 3 : 0;
    score += intersectionCount(preferences.blockedGenres, archetype.blockedGenres) * 5;

    if (hasOverlap(preferences.blockedGenres, archetype.preferredGenres)) score -= 18;
    if (hasOverlap(preferences.rejectedGenres, archetype.preferredGenres)) score -= 7;
    if (hasOverlap(preferences.rejectedLanguages, archetype.preferredLanguages)) score -= 6;
    if (hasOverlap(preferences.rejectedBlockedGenres, archetype.preferredGenres)) score += 4;

    for (const card of liked) {
      const multiplier = superIds.has(card.id) ? 2.4 : 1;
      score += cardArchetypeSignal(card, archetype) * multiplier;
    }
    for (const card of disliked) {
      score -= cardArchetypeSignal(card, archetype) * 0.85;
    }

    return { archetype, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);

  const best = scored[0];
  return { archetype: best.archetype, score: best.score };
}

function copyForIntensity(archetype: SoundLifeArchetype, intensity: RoastIntensity): string {
  if (intensity === "soft") return archetype.softCopy;
  if (intensity === "roast") return archetype.roastCopy;
  return archetype.accurateCopy;
}

function formatGenre(genre: string): string {
  return genre
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function topLikedLabels(liked: VibeCardData[], superVibed: VibeCardData[]): string[] {
  const superIds = new Set(superVibed.map((card) => card.id));
  const ranked = [...liked].sort((a, b) => {
    const superDelta = Number(superIds.has(b.id)) - Number(superIds.has(a.id));
    if (superDelta !== 0) return superDelta;
    return a.title.localeCompare(b.title);
  });
  return ranked.slice(0, 2).map((card) => `${card.emoji} ${card.title}`);
}

function strongestSignal(input: {
  filter: GlobalFilterOption;
  traitStats: TraitStat[];
  preferences: PreferenceSignals;
}): ResultMatchReason["strongestSignal"] {
  const { filter, traitStats, preferences } = input;
  const filterLanguage = filter.languages?.[0];
  const boostedLanguage = [...preferences.boostedLanguages][0] ?? filterLanguage;
  if (boostedLanguage) {
    return `${formatGenre(boostedLanguage)} kept showing up like it had a backstage pass.`;
  }

  const boostedGenre = [...preferences.boostedGenres][0] ?? filter.genres?.[0];
  if (boostedGenre) {
    return `${formatGenre(boostedGenre)} was the loudest signal in the room.`;
  }

  const topTrait = traitStats[0]?.trait ?? "energy";
  return `${TRAIT_META[topTrait].label} did most of the fingerprints.`;
}

function strongestSignalType(
  filter: GlobalFilterOption,
  preferences: PreferenceSignals
): ResultMatchReason["strongestSignalType"] {
  if (filter.languages?.[0] || preferences.boostedLanguages.size > 0) return "language";
  if (filter.genres?.[0] || preferences.boostedGenres.size > 0) return "genre";
  return "trait";
}

function buildWhyMatched(input: {
  liked: VibeCardData[];
  superVibed: VibeCardData[];
  disliked: VibeCardData[];
  traitStats: TraitStat[];
  preferences: PreferenceSignals;
  filter: GlobalFilterOption;
}): ResultMatchReason {
  const likedLabels = topLikedLabels(input.liked, input.superVibed);
  const fallbackLiked = input.liked.length === 0
    ? ["nothing, which is bold and mildly suspicious"]
    : likedLabels;
  const blockedGenre = [...input.preferences.blockedGenres][0];
  const rejectedCard = input.disliked[0];

  return {
    vibedWith: fallbackLiked,
    rejected: rejectedCard
      ? `${rejectedCard.emoji} ${rejectedCard.title} was escorted from the aux meeting.`
      : blockedGenre
        ? `${formatGenre(blockedGenre)} got politely removed from the premises.`
        : "No hard rejection, just chaotic open-mindedness.",
    strongestSignal: strongestSignal({
      filter: input.filter,
      traitStats: input.traitStats,
      preferences: input.preferences,
    }),
    strongestSignalType: strongestSignalType(input.filter, input.preferences),
  };
}

function buildVibeTags(
  traitStats: TraitStat[],
  songs: Song[],
  archetype: SoundLifeArchetype
): string[] {
  const tags = traitStats.slice(0, 3).map((stat) => TRAIT_META[stat.trait].label);
  const genreCounts = new Map<string, number>();
  for (const song of songs.slice(0, 5)) {
    for (const genre of song.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }
  const songGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre]) => formatGenre(genre));
  return [...new Set([...tags, ...songGenres, archetype.name])].slice(0, 5);
}

export function computeResults(
  catalog: Catalog,
  scenario: Scenario,
  liked: VibeCardData[],
  superVibed: VibeCardData[] = [],
  options: ResultOptions = {}
): ResultData {
  const disliked = options.disliked ?? [];
  const roastIntensity = options.roastIntensity ?? "accurate";
  const totals = accumulateTraits(scenario, liked, superVibed);
  const max = Math.max(...TRAITS.map((t) => totals[t]), 1);
  const normalized = Object.fromEntries(
    TRAITS.map((t) => [t, totals[t] / max])
  ) as Record<Trait, number>;

  const preferences = buildPreferences(liked, disliked);
  const {
    boostedGenres,
    blockedGenres,
    boostedLanguages,
    boostedRegions,
    rejectedGenres,
    rejectedLanguages,
    rejectedRegions,
  } = preferences;
  const filter = getFilter(options.filterId);

  const traitStats: TraitStat[] = TRAITS
    .map((trait) => ({ trait, value: totals[trait] }))
    .sort((a, b) => b.value - a.value || TRAITS.indexOf(a.trait) - TRAITS.indexOf(b.trait))
    .slice(0, 5)
    .map(({ trait, value }) => ({
      trait,
      percent: Math.round(15 + 83 * (value / max)),
    }));

  const topTraits = traitStats.slice(0, 3).map((s) => s.trait);
  const archetypeMatch = matchArchetype({
    scenario,
    topTraits,
    normalized,
    liked,
    superVibed,
    disliked,
    preferences,
    filter,
  });
  const archetype = archetypeMatch.archetype;

  const ranked = catalog.songs
    .map((song) => {
      let score =
        affinity(song.traits, normalized) +
        (song.scenarios.includes(scenario.id) ? SCENARIO_SONG_BONUS : 0) +
        (song.popularity ?? 0) * POPULARITY_WEIGHT;

      // Genre boost/block from typed vibe cards
      if (song.genres.some((g) => boostedGenres.has(g))) score += GENRE_BOOST;
      if (song.genres.some((g) => blockedGenres.has(g))) score += GENRE_BLOCK_PENALTY;
      if (boostedLanguages.has(song.language)) score += GENRE_BOOST;
      if (boostedRegions.has(song.region)) score += GENRE_BOOST;
      if (song.genres.some((g) => rejectedGenres.has(g))) score += REJECTED_PREFERENCE_PENALTY;
      if (rejectedLanguages.has(song.language)) score += REJECTED_PREFERENCE_PENALTY;
      if (rejectedRegions.has(song.region)) score += REJECTED_PREFERENCE_PENALTY;

      return { song, score };
    })
    .sort((a, b) => b.score - a.score || a.song.title.localeCompare(b.song.title))
    .map((r) => r.song);

  let songs: Song[];
  if (filter.id === "global" && !options.region) {
    songs = ranked.slice(0, RESULT_SONG_COUNT);
  } else {
    const matched = ranked.filter((s) => songMatchesFilter(s, filter, options.region));
    const rest = ranked.filter((s) => !songMatchesFilter(s, filter, options.region));
    songs = [...matched, ...rest].slice(0, RESULT_SONG_COUNT);
  }

  const secondShare = traitStats[1] ? traitStats[1].percent / 98 : 0.5;
  const superBonus = superVibed.length * 3;
  const archetypeBonus = Math.max(0, Math.min(6, Math.round(archetypeMatch.score / 18)));
  const matchPercent = Math.min(
    99,
    76 + liked.length * 2 + Math.round(6 * secondShare) + superBonus + archetypeBonus
  );

  return {
    identity: archetype.name,
    archetype,
    roastIntensity,
    resultCopy: copyForIntensity(archetype, roastIntensity),
    whyMatched: buildWhyMatched({
      liked,
      superVibed,
      disliked,
      traitStats,
      preferences,
      filter,
    }),
    vibeTags: buildVibeTags(traitStats, songs, archetype),
    matchPercent,
    traits: traitStats,
    songs,
    artists: pickArtists(songs, normalized, scenario),
    playlists: pickPlaylists(scenario, topTraits[0]),
    scenarioId: scenario.id,
    likedCount: liked.length,
    superVibeCount: superVibed.length,
    filterId: filter.id,
  };
}
