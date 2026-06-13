"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeCard from "./VibeCard";
import { pausePreview } from "@/lib/audio";
import { TRAIT_META } from "@/lib/data";
import { dominantTrait } from "@/lib/engine";
import { getHapticsEnabled, setHapticsEnabled, vibrate } from "@/lib/haptics";
import type { Scenario, VibeCardData } from "@/lib/types";

interface SwipeDeckProps {
  scenario: Scenario;
  deck: VibeCardData[];
  onComplete: (
    liked: VibeCardData[],
    superVibed: VibeCardData[],
    disliked: VibeCardData[]
  ) => void;
}

interface Feedback {
  text: string;
  color: string;
  key: number;
  isSuper?: boolean;
  isNope?: boolean;
}

interface SwipeHistoryEntry {
  index: number;
  liked: VibeCardData[];
  superVibed: VibeCardData[];
  disliked: VibeCardData[];
  direction: 1 | -1 | 2;
}

const PROGRESS_QUIPS = [
  "Your taste is taking shape...",
  "Getting suspiciously accurate...",
  "This is forming something...",
  "Keep going, the playlist is listening...",
  "Almost there — the identity is forming...",
  "One more vibe could change everything...",
];

const DONE_QUIPS = [
  "Turning your swipes into a music identity.",
  "Your sound is forming. Give it a second.",
  "The algorithm of you is loading.",
  "Computing your entire personality via vibes.",
];

const FINISH_DELAY_MS = 820;

function getProgressQuip(completed: number, total: number): string {
  if (completed === 0) return "Swipe right on what feels true.";
  const pct = completed / total;
  if (pct < 0.3) return PROGRESS_QUIPS[0];
  if (pct < 0.5) return PROGRESS_QUIPS[1];
  if (pct < 0.7) return PROGRESS_QUIPS[2];
  if (pct < 0.85) return PROGRESS_QUIPS[3];
  if (pct < 0.95) return PROGRESS_QUIPS[4];
  return PROGRESS_QUIPS[5];
}

export default function SwipeDeck({ scenario, deck, onComplete }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<VibeCardData[]>([]);
  const [superVibed, setSuperVibed] = useState<VibeCardData[]>([]);
  const [disliked, setDisliked] = useState<VibeCardData[]>([]);
  const [history, setHistory] = useState<SwipeHistoryEntry[]>([]);
  const [lastDirection, setLastDirection] = useState<1 | -1>(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [partyMode, setPartyMode] = useState(false);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const finishTimer = useRef<number | null>(null);
  const transitionLock = useRef(false);

  const done = index >= deck.length;
  const completedCount = Math.min(index, deck.length);
  const canUndo = history.length > 0;
  const cardsLeft = deck.length - index;

  const clearFinishTimer = useCallback(() => {
    if (!finishTimer.current) return;
    window.clearTimeout(finishTimer.current);
    finishTimer.current = null;
  }, []);

  const handleSwipe = useCallback(
    (direction: 1 | -1 | 2) => {
      if (transitionLock.current) return;
      if (index >= deck.length) return;

      clearFinishTimer();
      transitionLock.current = true;
      setIsTransitioning(true);
      const card = deck[index];
      const isLike = direction === 1 || direction === 2;
      const isSuper = direction === 2;
      const isNope = direction === -1;
      pausePreview();
      vibrate(isSuper ? [14, 34, 14] : isNope ? 8 : 12);

      const nextLiked = isLike ? [...liked, card] : liked;
      const nextSuperVibed = isSuper ? [...superVibed, card] : superVibed;
      const nextDisliked = isNope ? [...disliked, card] : disliked;

      setHistory((items) => [
        ...items,
        { index, liked, superVibed, disliked, direction },
      ]);
      setLastDirection(direction === -1 ? -1 : 1);
      setLiked(nextLiked);
      setSuperVibed(nextSuperVibed);
      setDisliked(nextDisliked);

      if (isSuper) {
        setFeedback({
          text: `Super Vibe! ${card.feedback}`,
          color: "#CA8A04",
          key: index,
          isSuper: true,
        });
      } else if (isLike) {
        setFeedback({
          text: card.feedback,
          color: TRAIT_META[dominantTrait(card.traits)].color,
          key: index,
        });
      } else if (isNope && card.cardType === "antiGenre") {
        setFeedback({
          text: card.feedback,
          color: "#DC2626",
          key: index,
          isNope: true,
        });
      } else {
        setFeedback(null);
      }

      const next = index + 1;
      setIndex(next);
      if (next >= deck.length) {
        finishTimer.current = window.setTimeout(
          () => onComplete(nextLiked, nextSuperVibed, nextDisliked),
          FINISH_DELAY_MS
        );
      }
    },
    [clearFinishTimer, deck, disliked, index, liked, superVibed, onComplete]
  );

  const handleUndo = useCallback(() => {
    const previous = history[history.length - 1];
    if (!previous) return;
    clearFinishTimer();
    transitionLock.current = false;
    setIsTransitioning(false);
    setHistory((items) => items.slice(0, -1));
    setIndex(previous.index);
    setLiked(previous.liked);
    setSuperVibed(previous.superVibed);
    setDisliked(previous.disliked);
    setLastDirection(previous.direction === 1 ? -1 : 1);
    setFeedback(null);
  }, [clearFinishTimer, history]);

  useEffect(() => {
    setHapticsOn(getHapticsEnabled());
    return () => {
      clearFinishTimer();
      pausePreview();
    };
  }, [clearFinishTimer]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 1100);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipe(1);
      if (e.key === "ArrowLeft") handleSwipe(-1);
      if (e.key === "ArrowUp") handleSwipe(2);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") handleUndo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwipe, handleUndo]);

  const progressQuip = getProgressQuip(completedCount, deck.length);
  const doneQuip = DONE_QUIPS[Math.floor(Math.random() * DONE_QUIPS.length)];
  const releaseTransition = useCallback(() => {
    transitionLock.current = false;
    setIsTransitioning(false);
  }, []);

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 py-2 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:py-6">
      {/* Left panel */}
      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="lg:self-center"
      >
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-amber">
          Swipe your vibe
        </p>
        <h2 className="mt-3 text-4xl font-black leading-[0.98] tracking-tight text-ink sm:text-5xl">
          {scenario.emoji} {scenario.label}
        </h2>
        <p className="mt-4 max-w-md text-base font-medium leading-7 text-muted">
          Right means this is you. Left means not today. Up means{" "}
          <span className="font-bold text-brand-gold">SUPER VIBE</span> — double weight.
        </p>

        {/* Progress */}
        <div className="mt-7 max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
              {done ? "Complete" : `${cardsLeft} card${cardsLeft === 1 ? "" : "s"} left`}
            </span>
            <span className="text-xs font-black tabular-nums text-gray-400">
              {Math.round((completedCount / deck.length) * 100)}%
            </span>
          </div>
          <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${deck.length}, 1fr)` }} aria-label="Swipe progress">
            {deck.map((card, i) => (
              <span
                key={card.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i < index
                    ? superVibed.some((s) => s.id === card.id)
                      ? "bg-yellow-400"
                      : liked.some((l) => l.id === card.id)
                        ? "bg-brand-teal"
                        : "bg-gray-300"
                    : i === index
                      ? "bg-gray-600"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={progressQuip}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs font-medium text-gray-400"
            >
              {progressQuip}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Key legend */}
        <div className="mt-7 grid max-w-md grid-cols-3 gap-2 text-sm">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-3">
            <p className="font-black text-red-500">← Nope</p>
            <p className="mt-1 text-xs text-gray-400">Not the mood.</p>
          </div>
          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-3 py-3">
            <p className="font-black text-yellow-600">↑ Super</p>
            <p className="mt-1 text-xs text-gray-400">Double weight.</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 px-3 py-3">
            <p className="font-black text-green-600">Like →</p>
            <p className="mt-1 text-xs text-gray-400">Add to signal.</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mt-6 max-w-md">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPartyMode((v) => !v)}
              aria-pressed={partyMode}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                partyMode
                  ? "border-purple-200 bg-purple-50 text-purple-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              {partyMode ? "Party Mode ON" : "Clean Mode"}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !hapticsOn;
                setHapticsOn(next);
                setHapticsEnabled(next);
              }}
              aria-pressed={hapticsOn}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                hapticsOn
                  ? "border-orange-200 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              Haptics {hapticsOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Card area */}
      <div className="lg:self-center">
        <div className="relative mx-auto h-[min(540px,68dvh)] min-h-[440px] w-[88vw] max-w-[380px] flex-shrink-0 sm:h-[560px] sm:max-w-[400px] lg:h-[590px] lg:w-[430px] lg:max-w-[430px]">
          <AnimatePresence custom={lastDirection} onExitComplete={releaseTransition}>
            {deck.slice(index, index + 4).map((card, i) => (
              <VibeCard
                key={card.id}
                card={card}
                stackPosition={i}
                onSwipe={handleSwipe}
                partyMode={partyMode}
                isLocked={isTransitioning}
              />
            ))}
          </AnimatePresence>

          {/* Done card */}
          <AnimatePresence>
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] border border-gray-100 bg-white p-8 text-center shadow-card-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-sm font-black uppercase tracking-[0.18em] text-white">
                  SL
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-brand-amber">
                  Building your result
                </p>
                <p className="mt-3 text-xl font-black leading-tight text-ink">
                  {doneQuip}
                </p>
                {superVibed.length > 0 && (
                  <p className="mt-2 text-sm text-yellow-600 font-bold">
                    {superVibed.length} Super Vibe{superVibed.length > 1 ? "s" : ""} boosted
                  </p>
                )}
                {canUndo && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={isTransitioning}
                    className="mt-6 min-h-[44px] rounded-full border border-gray-200 px-5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Undo last swipe
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback toast */}
          <AnimatePresence>
            {feedback && (
              <motion.span
                key={feedback.key}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                className="pointer-events-none absolute -top-4 left-1/2 z-30 -translate-x-1/2 rounded-full border px-4 py-2 text-sm font-bold shadow-card"
                style={{
                  color: feedback.color,
                  borderColor: `${feedback.color}44`,
                  backgroundColor: feedback.isSuper
                    ? "#fef9c3"
                    : feedback.isNope
                      ? "#fef2f2"
                      : "#f0fdf4",
                }}
              >
                {feedback.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="mx-auto mt-6 grid w-[88vw] max-w-[380px] grid-cols-[1fr_56px_56px_1fr] items-center gap-2 sm:max-w-[400px] lg:max-w-[430px]">
          <button
            type="button"
            onClick={() => handleSwipe(-1)}
            disabled={done || isTransitioning}
            className="flex min-h-[56px] items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-black text-red-500 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-40"
          >
            ← Nope
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo || isTransitioning}
            aria-label="Undo last swipe"
            className="flex min-h-[56px] items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-black text-gray-400 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30"
            title="Undo"
          >
            ↩
          </button>
          <button
            type="button"
            onClick={() => handleSwipe(2)}
            disabled={done || isTransitioning}
            aria-label="Super Vibe"
            className="flex min-h-[56px] items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 text-lg font-black text-yellow-600 transition-all hover:bg-yellow-100 active:scale-95 disabled:opacity-40"
            title="Super Vibe"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => handleSwipe(1)}
            disabled={done || isTransitioning}
            className="flex min-h-[56px] items-center justify-center rounded-full bg-brand-teal px-4 text-sm font-black text-white shadow-card transition-all hover:bg-brand-tealSoft active:scale-95 disabled:opacity-40"
          >
            Like →
          </button>
        </div>
      </div>
    </section>
  );
}
