"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import ScenarioPicker from "@/components/ScenarioPicker";
import SwipeDeck from "@/components/SwipeDeck";
import { FALLBACK_CATALOG } from "@/lib/catalog.fallback";
import { loadCatalog } from "@/lib/catalog";
import { buildDeck } from "@/lib/engine";
import type { Catalog, FilterId, Scenario, Step, VibeCardData } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog>(FALLBACK_CATALOG);
  const [step, setStep] = useState<Step>("landing");
  const [filter, setFilter] = useState<FilterId>("global");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [deck, setDeck] = useState<VibeCardData[]>([]);

  useEffect(() => {
    setCatalog(loadCatalog(setCatalog));
  }, []);

  const pickScenario = (next: Scenario) => {
    setScenario(next);
    setDeck(buildDeck(catalog, next));
    setStep("swipe");
  };

  const finishSwipe = (liked: VibeCardData[], superVibed: VibeCardData[]) => {
    if (!scenario) return;
    const params = new URLSearchParams();
    params.set("s", scenario.id);
    if (liked.length > 0) params.set("cards", liked.map((c) => c.id).join(","));
    if (superVibed.length > 0) params.set("super", superVibed.map((c) => c.id).join(","));
    if (filter !== "global") params.set("lang", filter);
    router.push(`/result?${params.toString()}`);
  };

  const goBack = () => {
    if (step === "scenario") setStep("landing");
    if (step === "swipe") {
      setScenario(null);
      setDeck([]);
      setStep("scenario");
    }
  };

  const showTopBar = step === "scenario" || step === "swipe";

  return (
    <main className="app-surface relative min-h-dvh overflow-x-hidden">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-7 lg:px-8">
        {showTopBar && (
          <header className="mx-auto mb-6 flex w-full max-w-5xl items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            >
              ←
            </button>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">
              SoundLife
            </span>
            <span className="w-11" aria-hidden />
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="flex w-full flex-1 flex-col"
          >
            {step === "landing" && (
              <LandingPage onStart={() => setStep("scenario")} />
            )}
            {step === "scenario" && (
              <ScenarioPicker
                scenarios={catalog.scenarios}
                filter={filter}
                onFilterChange={setFilter}
                onSelect={pickScenario}
              />
            )}
            {step === "swipe" && scenario && deck.length > 0 && (
              <SwipeDeck
                scenario={scenario}
                deck={deck}
                onComplete={finishSwipe}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
