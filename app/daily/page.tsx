"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SwipeDeck from "@/components/SwipeDeck";
import { FALLBACK_CATALOG } from "@/lib/catalog.fallback";
import { loadCatalog } from "@/lib/catalog";
import { getDailyPrompt } from "@/lib/daily";
import { buildDeck } from "@/lib/engine";
import type { Catalog, Scenario, VibeCardData } from "@/lib/types";

export default function DailyPage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog>(FALLBACK_CATALOG);
  const daily = useMemo(() => getDailyPrompt(), []);

  useEffect(() => {
    setCatalog(loadCatalog(setCatalog));
  }, []);

  const scenario: Scenario | null =
    catalog.scenarios.find((item) => item.id === daily.scenarioId) ??
    catalog.scenarios[0] ??
    null;
  const deck = useMemo(
    () => (scenario ? buildDeck(catalog, scenario, daily.seed) : []),
    [catalog, daily.seed, scenario]
  );

  const finishSwipe = (
    liked: VibeCardData[],
    superVibed: VibeCardData[],
    disliked: VibeCardData[]
  ) => {
    if (!scenario) return;
    const params = new URLSearchParams();
    params.set("s", scenario.id);
    params.set("daily", daily.date);
    params.set("seed", String(daily.seed));
    if (liked.length > 0) params.set("cards", liked.map((card) => card.id).join(","));
    if (superVibed.length > 0) params.set("super", superVibed.map((card) => card.id).join(","));
    if (disliked.length > 0) params.set("nope", disliked.map((card) => card.id).join(","));
    router.push(`/result?${params.toString()}`);
  };

  return (
    <main className="app-surface relative min-h-dvh overflow-x-hidden">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-7 lg:px-8">
        <header className="mx-auto mb-6 flex w-full max-w-5xl items-center justify-between">
          <Link
            href="/"
            aria-label="Go home"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-surface text-lg text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
          >
            ←
          </Link>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">
            Sound of the Day
          </span>
          <span className="w-11" aria-hidden />
        </header>

        {scenario && deck.length > 0 ? (
          <SwipeDeck scenario={scenario} deck={deck} onComplete={finishSwipe} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-500">
            Loading today&apos;s sound...
          </div>
        )}
      </div>
    </main>
  );
}
