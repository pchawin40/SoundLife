"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import BuildingScreen from "@/components/BuildingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { logResultEvent } from "@/lib/analytics";
import { FALLBACK_CATALOG } from "@/lib/catalog.fallback";
import { loadCatalog } from "@/lib/catalog";
import { computeResults } from "@/lib/engine";
import type { Catalog, FilterId, VibeCardData } from "@/lib/types";

const BUILDING_DELAY_MS = 1600;

/**
 * Shareable, query-param based result page (static-export friendly —
 * no dynamic route segment): /result?s=gym&cards=boxing,spicy-food&lang=korean
 */
export default function ResultPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-brand-teal/15 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-6 sm:max-w-lg">
        <Suspense fallback={<BuildingScreen />}>
          <ResultContent />
        </Suspense>
      </div>
    </main>
  );
}

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [catalog, setCatalog] = useState<Catalog>(FALLBACK_CATALOG);
  const [revealed, setRevealed] = useState(false);
  const logged = useRef(false);

  useEffect(() => {
    setCatalog(loadCatalog(setCatalog));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), BUILDING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const scenarioId = params.get("s");
  const cardIds = useMemo(
    () => (params.get("cards") ?? "").split(",").filter(Boolean),
    [params]
  );
  const lang = (params.get("lang") ?? "global") as FilterId;
  const region = params.get("region");

  const scenario = catalog.scenarios.find((s) => s.id === scenarioId) ?? null;

  const result = useMemo(() => {
    if (!scenario) return null;
    const byId = new Map(catalog.vibeCards.map((c) => [c.id, c]));
    const liked = cardIds
      .map((id) => byId.get(id))
      .filter((c): c is VibeCardData => Boolean(c));
    return computeResults(catalog, scenario, liked, {
      filterId: lang,
      region,
    });
  }, [catalog, scenario, cardIds, lang, region]);

  // Log once, async, only after the result is actually on screen.
  useEffect(() => {
    if (!revealed || !result || logged.current) return;
    logged.current = true;
    logResultEvent({ result, likedCardIds: cardIds, region });
  }, [revealed, result, cardIds, region]);

  if (!scenario || !result) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-center">
        <span className="text-5xl" aria-hidden>
          🎧
        </span>
        <h1 className="text-2xl font-extrabold text-cream">
          This link lost its vibe
        </h1>
        <p className="max-w-xs text-sm text-cream/60">
          The result you&apos;re looking for didn&apos;t survive the trip. Make a
          fresh one — it takes 30 seconds.
        </p>
        <Link
          href="/"
          className="mt-2 flex min-h-[52px] items-center rounded-2xl bg-brand-teal px-8 text-base font-bold text-white shadow-glow transition-colors hover:bg-brand-tealSoft"
        >
          Find my sound
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!revealed ? (
        <motion.div
          key="building"
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="flex w-full flex-1 flex-col"
        >
          <BuildingScreen />
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="flex w-full flex-1 flex-col"
        >
          <ResultsScreen
            result={result}
            catalog={catalog}
            onRedo={() => router.push("/")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
