"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TRAIT_META } from "@/lib/data";
import { FALLBACK_CATALOG } from "@/lib/catalog.fallback";
import { loadCatalog } from "@/lib/catalog";
import { computeResults } from "@/lib/engine";
import { compareResults, decodeResultParams } from "@/lib/match";
import { copyToClipboard } from "@/lib/share";
import type { Catalog, FilterId, ResultData, RoastIntensity, VibeCardData } from "@/lib/types";

const ROAST_INTENSITIES: RoastIntensity[] = ["soft", "accurate", "roast"];

function parseRoastIntensity(value: string | null): RoastIntensity {
  return ROAST_INTENSITIES.includes(value as RoastIntensity)
    ? (value as RoastIntensity)
    : "accurate";
}

function recomputeEncodedResult(catalog: Catalog, encoded: string | null): ResultData | null {
  const decoded = decodeResultParams(encoded);
  if (!decoded) return null;
  const params = decoded.params;
  const scenario = catalog.scenarios.find((item) => item.id === params.get("s"));
  if (!scenario) return null;

  const byId = new Map(catalog.vibeCards.map((card) => [card.id, card]));
  const toCards = (key: string): VibeCardData[] =>
    (params.get(key) ?? "")
      .split(",")
      .filter(Boolean)
      .map((id) => byId.get(id))
      .filter((card): card is VibeCardData => Boolean(card));

  return computeResults(catalog, scenario, toCards("cards"), toCards("super"), {
    filterId: (params.get("lang") ?? "global") as FilterId,
    region: params.get("region"),
    disliked: toCards("nope"),
    roastIntensity: parseRoastIntensity(params.get("tone")),
  });
}

function IdentityMiniCard({ label, result }: { label: string; result: ResultData }) {
  const primary = TRAIT_META[result.traits[0].trait];
  return (
    <article className="min-w-0 rounded-3xl border border-gray-100 bg-surface p-5 shadow-card">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
        {label}
      </p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h2 className="text-3xl font-black leading-none tracking-tight text-ink">
          {result.identity}
        </h2>
        <span className="text-3xl" aria-hidden>
          {result.archetype.emoji}
        </span>
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-gray-500">
        {result.resultCopy}
      </p>
      <div className="mt-4 space-y-2">
        {result.traits.slice(0, 3).map((stat) => {
          const meta = TRAIT_META[stat.trait];
          return (
            <div key={stat.trait} className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span aria-hidden>{meta.emoji}</span>
              <span className="w-24">{meta.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${stat.percent}%`, backgroundColor: meta.color }}
                />
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs font-black text-gray-400">
        {result.matchPercent}% solo match · strongest signal {primary.label.toLowerCase()}
      </p>
    </article>
  );
}

function MatchContent() {
  const params = useSearchParams();
  const [catalog, setCatalog] = useState<Catalog>(FALLBACK_CATALOG);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCatalog(loadCatalog(setCatalog));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const aSeed = params.get("a");
  const bSeed = params.get("b");
  const resultA = useMemo(() => recomputeEncodedResult(catalog, aSeed), [catalog, aSeed]);
  const resultB = useMemo(() => recomputeEncodedResult(catalog, bSeed), [catalog, bSeed]);
  const match = useMemo(
    () => (resultA && resultB ? compareResults(resultA, resultB) : null),
    [resultA, resultB]
  );

  const invitePath = aSeed ? `/?match=${encodeURIComponent(aSeed)}` : "/";
  const copyInvite = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${invitePath}`;
    setToast((await copyToClipboard(url)) ? "Friend handoff copied ✓" : "Couldn't copy link");
  };

  if (!resultA) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <span className="text-5xl" aria-hidden>🎧</span>
        <h1 className="text-3xl font-black text-ink">This match link lost the plot</h1>
        <Link href="/" className="rounded-full bg-ink px-7 py-3 text-sm font-black text-paper">
          Make a fresh SoundLife
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col py-6">
      <p className="text-center text-xs font-black uppercase tracking-[0.22em] text-brand-amber">
        SoundLife duet mode
      </p>
      <h1 className="mx-auto mt-3 max-w-2xl text-center text-5xl font-black leading-[0.95] tracking-tight text-ink">
        {match ? `${match.matchPercent}% aux compatibility` : "Send this before handing over aux"}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-base font-semibold leading-7 text-gray-500">
        {match
          ? "The group chat may proceed with cautious optimism."
          : "Your side is locked. Your friend needs to make theirs, then SoundLife will judge the overlap."}
      </p>

      {match && (
        <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {match.sharedTraits.length > 0 ? (
            match.sharedTraits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border border-gray-200 bg-surface px-3 py-1 text-xs font-black text-gray-600"
              >
                {TRAIT_META[trait].emoji} shared {TRAIT_META[trait].label.toLowerCase()}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-black text-red-500">
              no shared top traits, dangerous but interesting
            </span>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <IdentityMiniCard label="You" result={resultA} />
        {resultB ? (
          <IdentityMiniCard label="Friend" result={resultB} />
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white/70 p-5 text-center shadow-sm">
            <p className="text-4xl" aria-hidden>👀</p>
            <h2 className="mt-3 text-2xl font-black text-ink">Friend slot open</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-gray-500">
              Send them the handoff link. They finish their result and this page becomes a compatibility card.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={copyInvite}
                className="min-h-[48px] rounded-full bg-ink px-6 text-sm font-black text-paper"
              >
                Copy friend handoff
              </button>
              <Link
                href={invitePath}
                className="flex min-h-[48px] items-center justify-center rounded-full border border-gray-200 bg-surface px-6 text-sm font-black text-gray-700"
              >
                Open handoff
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm font-black text-brand-teal hover:underline">
          Make another result
        </Link>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-gray-200 bg-surface px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-card-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function MatchPage() {
  return (
    <main className="app-surface relative min-h-dvh overflow-x-hidden">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-6 sm:px-7 lg:px-8">
        <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-500">Loading match...</div>}>
          <MatchContent />
        </Suspense>
      </div>
    </main>
  );
}
