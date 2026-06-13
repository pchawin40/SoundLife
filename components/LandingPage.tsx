"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getCardVisual } from "@/lib/cardVisuals";
import type { VibeCardData } from "@/lib/types";

interface LandingPageProps {
  onStart: () => void;
  onChooseScene?: () => void;
}

const PREVIEW_CARD: VibeCardData = {
  id: "tokyo-neon-walk",
  emoji: "🌃",
  title: "Tokyo night drive",
  subtitle: "Neon rain. Quiet confidence. Main-character silence.",
  traits: { cinematic: 2, darkness: 2, focus: 1 },
  feedback: "+ Cinematic",
  cardType: "region",
};

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
          {/* Native img enables jpg -> legacy png -> gradient fallback chain */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUrl}
            alt={visual.imageAlt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: visual.imagePosition ?? "center" }}
            onError={() => setActiveIndex((index) => index + 1)}
          />
          <div className="absolute inset-0" style={{ backgroundImage: visual.overlay }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: visual.background }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/5" />
      <div className="absolute left-5 top-5 -rotate-12 rounded-xl border-[3px] border-green-500 bg-white/95 px-4 py-1.5 text-base font-black uppercase tracking-wider text-green-500 shadow-card backdrop-blur-sm">
        Like
      </div>
    </div>
  );
}

function SwipePreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
      className="mx-auto w-full max-w-[430px] lg:max-w-[470px]"
    >
      <div className="relative aspect-[0.76] w-full overflow-hidden rounded-[32px] bg-white shadow-card-lg ring-1 ring-black/[0.05]">
        <PreviewImagePanel card={PREVIEW_CARD} />
        <div className="flex h-[31%] flex-col justify-center px-7 text-left">
          <h2 className="text-3xl font-black leading-none tracking-tight text-gray-950 sm:text-4xl">
            {PREVIEW_CARD.title}
          </h2>
          <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-gray-500">
            {PREVIEW_CARD.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage({ onStart, onChooseScene }: LandingPageProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <section className="grid min-h-[calc(100dvh-2.5rem)] w-full items-center gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-2xl flex-col items-start text-left"
        >
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-gray-600 shadow-sm">
            SoundLife
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Find the playlist your mood was trying to explain.
          </h1>

          <p className="mt-6 max-w-xl text-base font-semibold leading-7 text-muted sm:text-lg">
            Swipe a few cards. Get your sound identity and a playlist that actually feels like you.
          </p>

          <div className="mt-8">
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="min-h-[58px] rounded-full bg-ink px-9 text-base font-black text-white shadow-card-lg transition-colors hover:bg-gray-800"
            >
              Start swiping
            </motion.button>
            <p className="mt-3 text-sm font-semibold text-gray-400">
              No login. 30 seconds.
            </p>
          </div>
        </motion.div>

        <SwipePreviewCard />
      </section>

      {onChooseScene && (
        <section className="pb-20 pt-6">
          <div className="mx-auto max-w-sm rounded-2xl border border-gray-100 bg-white/50 px-6 py-5 text-center">
            <p className="text-sm font-black text-ink">Want a specific vibe?</p>
            <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
              Pick a scene like drive, gym, focus, party, heartbreak, or chill.
            </p>
            <button
              type="button"
              onClick={onChooseScene}
              className="mt-4 min-h-[40px] rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800"
            >
              Choose a scene
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
