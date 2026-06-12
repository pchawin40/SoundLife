"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BuildingScreen from "@/components/BuildingScreen";
import LandingPage from "@/components/LandingPage";
import ResultsScreen from "@/components/ResultsScreen";
import ScenarioPicker from "@/components/ScenarioPicker";
import SwipeDeck from "@/components/SwipeDeck";
import { buildDeck, computeResults } from "@/lib/engine";
import type { ResultData, Scenario, Step, VibeCardData } from "@/lib/types";

const BUILDING_DELAY_MS = 1600;

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [deck, setDeck] = useState<VibeCardData[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const buildTimer = useRef<number | null>(null);

  const pickScenario = (next: Scenario) => {
    setScenario(next);
    setDeck(buildDeck(next));
    setStep("swipe");
  };

  const finishSwipe = (liked: VibeCardData[]) => {
    if (!scenario) return;
    setResult(computeResults(scenario, liked));
    setStep("building");
    if (buildTimer.current) window.clearTimeout(buildTimer.current);
    buildTimer.current = window.setTimeout(
      () => setStep("results"),
      BUILDING_DELAY_MS
    );
  };

  const redo = () => {
    setScenario(null);
    setDeck([]);
    setResult(null);
    setStep("scenario");
  };

  const goBack = () => {
    if (step === "scenario") setStep("landing");
    if (step === "swipe") redo();
  };

  const showTopBar = step === "scenario" || step === "swipe";

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-brand-teal/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-brand-amber/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-6 sm:max-w-lg">
        {showTopBar && (
          <header className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-cream/80 transition-colors hover:bg-white/10"
            >
              ←
            </button>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-cream/50">
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
            {step === "scenario" && <ScenarioPicker onSelect={pickScenario} />}
            {step === "swipe" && scenario && deck.length > 0 && (
              <SwipeDeck
                scenario={scenario}
                deck={deck}
                onComplete={finishSwipe}
              />
            )}
            {step === "building" && <BuildingScreen />}
            {step === "results" && result && (
              <ResultsScreen result={result} onRedo={redo} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
