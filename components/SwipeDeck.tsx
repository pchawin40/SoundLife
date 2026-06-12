"use client";

import { useEffect, useState } from "react";
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

export default function SwipeDeck({ scenario, deck, onComplete }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<VibeCardData[]>([]);
  const [lastDirection, setLastDirection] = useState<1 | -1>(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const done = index >= deck.length;

  const handleSwipe = (direction: 1 | -1) => {
    if (done) return;
    const card = deck[index];
    const nextLiked = direction === 1 ? [...liked, card] : liked;
    setLastDirection(direction);
    setLiked(nextLiked);
    if (direction === 1) {
      setFeedback({
        text: card.feedback,
        color: TRAIT_META[dominantTrait(card.traits)].color,
        key: index,
      });
    }
    const next = index + 1;
    setIndex(next);
    if (next >= deck.length) {
      window.setTimeout(() => onComplete(nextLiked), 420);
    }
  };

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 1000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipe(1);
      if (e.key === "ArrowLeft") handleSwipe(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Progress */}
      <div className="mb-5 flex items-center justify-between text-sm">
        <span className="font-semibold text-cream/70">
          {scenario.emoji} {scenario.label}
        </span>
        <span className="font-bold tabular-nums text-cream/70">
          {Math.min(index + 1, deck.length)} / {deck.length}
        </span>
      </div>
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-brand-teal"
          animate={{ width: `${(index / deck.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Card stack */}
      <div className="relative mx-auto h-[400px] w-full max-w-sm flex-shrink-0 sm:h-[420px]">
        <AnimatePresence custom={lastDirection}>
          {deck.slice(index, index + 3).map((card, i) => (
            <VibeCard
              key={card.id}
              card={card}
              stackPosition={i}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>

        {/* Swipe feedback chip */}
        <AnimatePresence>
          {feedback && (
            <motion.span
              key={feedback.key}
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: -6, scale: 1 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 rounded-full border px-3.5 py-1.5 text-sm font-bold shadow-card"
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

      {/* Action buttons */}
      <div className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => handleSwipe(-1)}
          disabled={done}
          className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-base font-bold text-cream transition-all hover:bg-white/10 active:scale-95 disabled:opacity-40"
        >
          <span aria-hidden>❌</span> Not me
        </button>
        <button
          type="button"
          onClick={() => handleSwipe(1)}
          disabled={done}
          className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 text-base font-bold text-white shadow-glow transition-all hover:bg-brand-tealSoft active:scale-95 disabled:opacity-40"
        >
          <span aria-hidden>✅</span> Vibe
        </button>
      </div>
    </div>
  );
}
