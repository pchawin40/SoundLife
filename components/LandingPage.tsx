"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCardVisual } from "@/lib/cardVisuals";
import type { VibeCardData } from "@/lib/types";

interface LandingPageProps {
  onStart: () => void;
  onChooseScene?: () => void;
  streak?: number;
  collectionCount?: number;
  dailyEmoji?: string;
  dailyLabel?: string;
}

const SCENE_CHIPS: Array<{ emoji: string; label: string; id: string }> = [
  { emoji: "🚗", label: "Drive", id: "drive" },
  { emoji: "💪", label: "Gym", id: "gym" },
  { emoji: "🎯", label: "Focus", id: "focus" },
  { emoji: "🎉", label: "Party", id: "party" },
  { emoji: "💙", label: "Sad", id: "sad" },
  { emoji: "😌", label: "Chill", id: "chill" },
];

const PREVIEW_CARDS: VibeCardData[] = [
  {
    id: "tokyo-neon-walk",
    emoji: "🌃",
    title: "Tokyo night drive",
    subtitle: "Neon rain. Quiet confidence. Main-character silence.",
    traits: { cinematic: 2, darkness: 2, focus: 1 },
    feedback: "+ Cinematic",
    cardType: "region",
  },
  {
    id: "late-night-highway",
    emoji: "🌙",
    title: "Late-night highway",
    subtitle: "Empty roads, heavy thoughts",
    traits: { darkness: 2, cinematic: 2, focus: 1 },
    feedback: "+ Dark",
    cardType: "lifestyle",
  },
  {
    id: "dance-floor-preview",
    emoji: "🕺",
    title: "Dance floor",
    subtitle: "Everyone's watching. Nobody cares.",
    traits: { energy: 2, chaos: 2, confidence: 1 },
    feedback: "+ Energy",
    cardType: "mood",
  },
];

const SWIPE_LABELS = ["Like", "Super!", "Like"];

function PreviewImagePanel({ card }: { card: VibeCardData }) {
  const visual = getCardVisual(card);
  const candidates = useMemo(
    () =>
      [visual.imageUrl, visual.legacyImageUrl].filter((url): url is string => Boolean(url)),
    [visual.imageUrl, visual.legacyImageUrl]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [card.id, visual.imageUrl, visual.legacyImageUrl]);

  const activeUrl = candidates[activeIndex];

  return (
    <div className="relative h-[69%] overflow-hidden">
      {activeUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUrl}
            alt={visual.imageAlt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: visual.imagePosition ?? "center" }}
            onError={() => setActiveIndex((i) => i + 1)}
          />
          <div className="absolute inset-0" style={{ backgroundImage: visual.overlay }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: visual.background }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/5" />
    </div>
  );
}

function AnimatedPreviewDeck() {
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<1 | 2>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwipeDir(cardIndex === 1 ? 2 : 1);
      setCardIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [cardIndex]);

  const card = PREVIEW_CARDS[cardIndex];
  const labelColor = swipeDir === 2 ? "#CA8A04" : "#22C55E";
  const labelText = SWIPE_LABELS[cardIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
      className="mx-auto w-full max-w-[430px] lg:max-w-[470px]"
    >
      <div className="relative aspect-[0.76] w-full overflow-hidden rounded-[32px] bg-surface shadow-card-lg ring-1 ring-black/[0.05]">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0, x: 60, rotate: 4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{
              opacity: 0,
              x: swipeDir === 2 ? 30 : 80,
              y: swipeDir === 2 ? -60 : 20,
              rotate: swipeDir === 2 ? -8 : 12,
            }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
          >
            <PreviewImagePanel card={card} />
            <div className="flex h-[31%] flex-col justify-center px-7 text-left">
              <h2 className="text-3xl font-black leading-none tracking-tight text-gray-950 sm:text-4xl">
                {card.title}
              </h2>
              <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-gray-500">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe label badge */}
        <AnimatePresence>
          <motion.div
            key={`label-${cardIndex}`}
            initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.28 }}
            className="absolute left-5 top-5 rounded-xl border-[3px] bg-white/95 px-4 py-1.5 text-base font-black uppercase tracking-wider shadow-card backdrop-blur-sm"
            style={{ borderColor: labelColor, color: labelColor }}
          >
            {labelText}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-[32%] left-1/2 flex -translate-x-1/2 gap-1.5">
          {PREVIEW_CARDS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === cardIndex ? 20 : 6,
                backgroundColor: i === cardIndex ? "#1a1a1a" : "#d1d5db",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage({
  onStart,
  onChooseScene,
  streak = 0,
  collectionCount = 0,
  dailyEmoji,
  dailyLabel,
}: LandingPageProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <section className="grid min-h-[calc(100dvh-2.5rem)] w-full items-center gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-2xl flex-col items-start text-left"
        >
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-surface px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-gray-600 shadow-sm">
            SoundLife
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Find the playlist your mood was trying to explain.
          </h1>

          <p className="mt-6 max-w-xl text-base font-semibold leading-7 text-muted sm:text-lg">
            Swipe a few cards. Get your sound identity and a playlist that actually feels like you.
          </p>

          {/* Daily + streak strip */}
          {dailyLabel && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 px-3 py-1.5 text-xs font-black text-brand-teal">
                <span aria-hidden>{dailyEmoji ?? "🎧"}</span>
                Sound of the Day · {dailyLabel}
              </span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700">
                  <span aria-hidden>🔥</span>
                  {streak} day{streak === 1 ? "" : "s"} — keep it alive
                </span>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="min-h-[58px] rounded-full bg-ink px-9 text-base font-black text-paper shadow-card-lg transition-colors hover:bg-gray-800"
            >
              {streak > 0 ? "Continue your streak" : "Start swiping"}
            </motion.button>
            <p className="text-sm font-semibold text-gray-400">No login. 30 seconds.</p>
          </div>

          {/* Scene chips */}
          {onChooseScene && (
            <div className="mt-7">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                Or pick a scene
              </p>
              <div className="flex flex-wrap gap-2">
                {SCENE_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={onChooseScene}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-surface px-3.5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                  >
                    <span aria-hidden>{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {collectionCount > 0 && (
            <a
              href="/collection"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-gray-500 transition-colors hover:text-ink"
            >
              Your collection · {collectionCount} discovered →
            </a>
          )}
        </motion.div>

        <AnimatedPreviewDeck />
      </section>
    </div>
  );
}
