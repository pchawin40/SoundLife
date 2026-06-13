"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeCard from "./VibeCard";
import { TRAIT_META } from "@/lib/data";
import { dominantTrait } from "@/lib/engine";
import type { Scenario, VibeCardData } from "@/lib/types";

interface SwipeDeckProps {
  scenario: Scenario;
  deck: VibeCardData[];
  onComplete: (liked: VibeCardData[]) => void;
}

interface Feedback {
  text: string;
  color: string;
  key: number;
}

interface SwipeHistoryEntry {
  index: number;
  liked: VibeCardData[];
  direction: 1 | -1;
}

export default function SwipeDeck({ scenario, deck, onComplete }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<VibeCardData[]>([]);
  const [history, setHistory] = useState<SwipeHistoryEntry[]>([]);
  const [lastDirection, setLastDirection] = useState<1 | -1>(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const finishTimer = useRef<number | null>(null);

  const done = index >= deck.length;
  const completedCount = Math.min(index, deck.length);
  const currentCard = Math.min(index + 1, deck.length);
  const canUndo = history.length > 0;

  const clearFinishTimer = useCallback(() => {
    if (!finishTimer.current) return;
    window.clearTimeout(finishTimer.current);
    finishTimer.current = null;
  }, []);

  const handleSwipe = useCallback(
    (direction: 1 | -1) => {
      if (index >= deck.length) return;

      clearFinishTimer();
      const card = deck[index];
      const nextLiked = direction === 1 ? [...liked, card] : liked;

      setHistory((items) => [
        ...items,
        {
          index,
          liked,
          direction,
        },
      ]);
      setLastDirection(direction);
      setLiked(nextLiked);

      if (direction === 1) {
        setFeedback({
          text: card.feedback,
          color: TRAIT_META[dominantTrait(card.traits)].color,
          key: index,
        });
      } else {
        setFeedback(null);
      }

      const next = index + 1;
      setIndex(next);
      if (next >= deck.length) {
        finishTimer.current = window.setTimeout(() => onComplete(nextLiked), 680);
      }
    },
    [clearFinishTimer, deck, index, liked, onComplete]
  );

  const handleUndo = useCallback(() => {
    const previous = history[history.length - 1];
    if (!previous) return;
    clearFinishTimer();
    setHistory((items) => items.slice(0, -1));
    setIndex(previous.index);
    setLiked(previous.liked);
    setLastDirection(previous.direction === 1 ? -1 : 1);
    setFeedback(null);
  }, [clearFinishTimer, history]);

  useEffect(() => {
    return () => clearFinishTimer();
  }, [clearFinishTimer]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 1050);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipe(1);
      if (e.key === "ArrowLeft") handleSwipe(-1);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") handleUndo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwipe, handleUndo]);

  return (
    <section className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 py-2 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:py-6">
      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="lg:self-center"
      >
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-amberSoft">
          Swipe your vibe
        </p>
        <h2 className="mt-3 text-4xl font-black leading-[0.98] tracking-tight text-cream sm:text-5xl">
          {scenario.emoji} {scenario.label}
        </h2>
        <p className="mt-4 max-w-md text-base font-medium leading-7 text-cream/60">
          Right means “this is me today.” Left means “not this version of me.”
          The deck only needs a few honest instincts.
        </p>

        <div className="mt-7 max-w-md">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-cream/40">
            <span>
              Card {currentCard} of {deck.length}
            </span>
            <span>{Math.round((completedCount / deck.length) * 100)}%</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Swipe progress">
            {deck.map((card, i) => (
              <span
                key={card.id}
                className={`h-2 rounded-full transition-colors ${
                  i < index
                    ? "bg-brand-tealSoft"
                    : i === index
                      ? "bg-cream/75"
                      : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-7 grid max-w-md grid-cols-2 gap-3 text-sm">
          <div className="border-l border-[#E2574C]/70 bg-[#17130f]/70 px-4 py-3">
            <p className="font-black uppercase tracking-[0.14em] text-[#E2574C]">
              ← Pass
            </p>
            <p className="mt-1 text-cream/50">Not the mood.</p>
          </div>
          <div className="border-l border-brand-tealSoft bg-[#17130f]/70 px-4 py-3">
            <p className="font-black uppercase tracking-[0.14em] text-brand-tealSoft">
              Vibe →
            </p>
            <p className="mt-1 text-cream/50">Add it to the signal.</p>
          </div>
        </div>
      </motion.aside>

      <div className="lg:self-center">
        <div className="relative mx-auto h-[410px] w-full max-w-[390px] flex-shrink-0 sm:h-[460px] lg:h-[500px]">
          <AnimatePresence custom={lastDirection}>
            {deck.slice(index, index + 4).map((card, i) => (
              <VibeCard
                key={card.id}
                card={card}
                stackPosition={i}
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[30px] border border-white/10 bg-[#17130f] p-8 text-center shadow-card"
              >
                <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-amberSoft">
                  Building your result
                </p>
                <p className="mt-4 text-2xl font-black leading-tight text-cream">
                  Turning those swipes into a music identity.
                </p>
                {canUndo && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="mt-6 min-h-[44px] rounded-full border border-white/15 px-5 text-sm font-bold text-cream transition-colors hover:bg-white/10"
                  >
                    Undo last swipe
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.span
                key={feedback.key}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="pointer-events-none absolute -top-3 left-1/2 z-30 -translate-x-1/2 rounded-full border px-3.5 py-1.5 text-sm font-bold shadow-card"
                style={{
                  color: feedback.color,
                  borderColor: `${feedback.color}66`,
                  backgroundColor: "#1A1714",
                }}
              >
                {feedback.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-[390px] grid-cols-[1fr_76px_1fr] items-center gap-3">
          <button
            type="button"
            onClick={() => handleSwipe(-1)}
            disabled={done}
            className="flex min-h-[56px] items-center justify-center rounded-full border border-white/15 bg-[#17130f]/90 px-4 text-sm font-black text-cream transition-all hover:border-[#E2574C]/70 hover:text-white active:scale-95 disabled:opacity-40"
          >
            ← Pass
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex min-h-[56px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-black uppercase tracking-[0.08em] text-cream/70 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-30"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => handleSwipe(1)}
            disabled={done}
            className="flex min-h-[56px] items-center justify-center rounded-full bg-cream px-4 text-sm font-black text-ink shadow-card transition-all hover:bg-white active:scale-95 disabled:opacity-40"
          >
            Vibe →
          </button>
        </div>
      </div>
    </section>
  );
}
