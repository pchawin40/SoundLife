import type { ResultData, Trait, TraitStat } from "./types";

export interface CompatibilityResult {
  matchPercent: number;
  sharedTraits: Trait[];
}

export interface EncodedResultParams {
  params: URLSearchParams;
}

function statMap(stats: TraitStat[]): Map<Trait, number> {
  return new Map(stats.map((stat) => [stat.trait, stat.percent]));
}

export function compareResults(
  resultA: Pick<ResultData, "traits">,
  resultB: Pick<ResultData, "traits">
): CompatibilityResult {
  const a = statMap(resultA.traits);
  const b = statMap(resultB.traits);
  const sharedTraits = resultA.traits
    .map((stat) => stat.trait)
    .filter((trait) => b.has(trait))
    .slice(0, 4);

  const allTraits = new Set<Trait>([...a.keys(), ...b.keys()]);
  let overlap = 0;
  let possible = 0;
  for (const trait of allTraits) {
    const av = a.get(trait) ?? 0;
    const bv = b.get(trait) ?? 0;
    overlap += Math.min(av, bv);
    possible += Math.max(av, bv);
  }

  const raw = possible > 0 ? overlap / possible : 0.5;
  const topTraitBonus = sharedTraits.slice(0, 2).length * 4;
  const matchPercent = Math.max(1, Math.min(99, Math.round(raw * 90 + topTraitBonus)));
  return { matchPercent, sharedTraits };
}

function toBase64Url(value: string): string {
  const base64 =
    typeof btoa === "function"
      ? btoa(value)
      : Buffer.from(value, "utf8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "="
  );
  if (typeof atob === "function") return atob(padded);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function encodeResultParams(search: string | URLSearchParams): string {
  const params =
    typeof search === "string"
      ? new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
      : search;
  return toBase64Url(params.toString());
}

export function decodeResultParams(value: string | null): EncodedResultParams | null {
  if (!value) return null;
  try {
    return { params: new URLSearchParams(fromBase64Url(value)) };
  } catch {
    return null;
  }
}
