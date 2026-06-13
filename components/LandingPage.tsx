"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  resolveVibeTags,
  resolveVibeVisual,
  type VibeVisualInput,
} from "@/lib/vibeVisuals";

interface LandingPageProps {
  onStart: () => void;
}

const VIRAL_LINES = [
  "You're not sad. You're cinematic.",
  "Gym villain arc unlocked.",
  "This sounds like walking fast and ignoring texts.",
  "Your music taste has main character damage.",
  "No cowboy sadness. Got it.",
  "Global heat unlocked.",
  "This is getting suspiciously accurate.",
];

const RESULT_EXAMPLES = [
  { label: "Gym Villain Arc", color: "#DC2626" },
  { label: "Tokyo Night Drive", color: "#7C3AED" },
  { label: "Velvet Chaos", color: "#9333EA" },
  { label: "Afrobeats Sunshine", color: "#D97706" },
  { label: "Korean Night Drive", color: "#DB2777" },
  { label: "Soft Beach Sunset", color: "#0D9488" },
];

type MockCard = VibeVisualInput & {
  sticker: "LIKE" | "NOPE" | "SUPER VIBE";
  subtitle: string;
};

const MOCK_CARDS: MockCard[] = [
  {
    id: "afrobeats-sunshine",
    title: "Afrobeats sunshine",
    subtitle: "Warm rhythm, real outside energy",
    cardType: "genre",
    sticker: "LIKE",
    traits: { warmth: 2, tempo: 2, energy: 1 },
  },
  {
    id: "tokyo-night-drive",
    title: "Tokyo night drive",
    subtitle: "Neon rain and main-character silence",
    cardType: "region",
    sticker: "SUPER VIBE",
    traits: { cinematic: 2, darkness: 2, focus: 1 },
  },
  {
    id: "gym-villain-arc",
    title: "Gym villain arc",
    subtitle: "The final rep became personal",
    cardType: "mood",
    sticker: "LIKE",
    traits: { aggression: 2, confidence: 2, energy: 2 },
  },
  {
    id: "soft-beach-sunset",
    title: "Soft beach sunset",
    subtitle: "Golden hour with the volume low",
    cardType: "lifestyle",
    sticker: "NOPE",
    traits: { warmth: 2, softness: 2, romance: 1 },
  },
];

const STICKER_STYLES = {
  LIKE: "left-5 top-7 -rotate-12 border-green-500 text-green-500",
  NOPE: "right-5 top-7 rotate-12 border-red-500 text-red-500",
  "SUPER VIBE": "left-1/2 top-7 -translate-x-1/2 -rotate-3 border-yellow-400 text-yellow-500",
};

function MockSwipePreview() {
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<1 | -1>(1);

  useEffect(() => {
    let cardTimer: number | undefined;
    const t = window.setInterval(() => {
      setSwipeDir(Math.random() > 0.4 ? 1 : -1);
      cardTimer = window.setTimeout(
        () => setCardIndex((i) => (i + 1) % MOCK_CARDS.length),
        260
      );
    }, 2500);
    return () => {
      window.clearInterval(t);
      if (cardTimer) window.clearTimeout(cardTimer);
    };
  }, []);

  const card = MOCK_CARDS[cardIndex];
  const visual = resolveVibeVisual(card);
  const tags = resolveVibeTags(card, visual);
  const visualStyle = visual.imageUrl
    ? {
        backgroundImage: `${visual.overlay}, url(${visual.imageUrl})`,
        backgroundPosition: visual.imagePosition ?? "center",
        backgroundSize: "cover",
      }
    : { background: visual.background };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
      className="relative mx-auto w-full max-w-[440px]"
    >
      <div className="relative mx-auto h-[500px] w-[88vw] max-w-[390px] sm:h-[520px] sm:max-w-[420px]">
        {/* Stack cards behind */}
        <div className="absolute left-9 top-5 h-[94%] w-[88%] -rotate-3 rounded-[28px] bg-white shadow-card opacity-70" />
        <div className="absolute right-0 top-10 h-[88%] w-[84%] rotate-3 rounded-[28px] bg-white shadow-card opacity-50" />

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ scale: 0.95, opacity: 0, x: swipeDir * -46, rotate: swipeDir * -2 }}
            animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            exit={{ x: swipeDir * 260, rotate: swipeDir * 8, opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden rounded-[30px] bg-white shadow-card-lg ring-1 ring-black/[0.04]"
          >
            <div className="relative h-[68%] overflow-hidden" style={visualStyle}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-white/5" />
              <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-800 shadow-sm backdrop-blur-md">
                Preview
              </span>
              <span className="absolute right-4 top-4 rounded-full border border-white/35 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-md">
                {visual.eyebrow}
              </span>
            </div>

            <div className="flex h-[32%] flex-col items-start justify-between px-6 pb-7 pt-5 text-left">
              <div>
                <h3 className="text-[27px] font-black leading-[1.02] tracking-tight text-gray-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-5 text-gray-500">
                  {card.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]"
                    style={{
                      backgroundColor: `${visual.accent}12`,
                      borderColor: `${visual.accent}2E`,
                      color: visual.accent,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`absolute rounded-xl border-[3px] bg-white/95 px-4 py-1.5 text-base font-black uppercase tracking-wider shadow-card backdrop-blur-sm ${STICKER_STYLES[card.sticker]}`}
            >
              {card.sticker}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mock result chips */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {RESULT_EXAMPLES.slice(0, 3).map((r) => (
          <span
            key={r.label}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black"
            style={{ borderColor: `${r.color}44`, color: r.color, backgroundColor: `${r.color}10` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
            {r.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const STEPS = [
  { eyebrow: "01 Pick a moment", copy: "Drive, gym, focus, party, heartbreak, chill, or full chaos." },
  { eyebrow: "02 Swipe your vibe", copy: "Right = this is me. Left = not today. Up = SUPER VIBE." },
  { eyebrow: "03 Get the identity", copy: "A shareable card, a tracklist, a music identity." },
];

export default function LandingPage({ onStart }: LandingPageProps) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setLineIndex((i) => (i + 1) % VIRAL_LINES.length),
      2800
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full flex-1 items-center py-8 lg:min-h-[calc(100dvh-2.5rem)] lg:py-10">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: copy */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-teal" aria-hidden />
            SoundLife
          </div>

          {/* Headline */}
          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.93] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Find the playlist your mood was trying to explain.
          </h1>

          {/* Subline */}
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-muted sm:text-xl">
            Swipe a few instincts. Get a music identity, a shareable card, and a tracklist that
            sounds less algorithmic and more like "that is unfortunately me."
          </p>

          {/* Rotating quip */}
          <div className="mt-5 min-h-[32px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26 }}
                className="text-base font-black text-brand-amber sm:text-lg"
              >
                {VIRAL_LINES[lineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="min-h-[58px] rounded-full bg-ink px-8 text-base font-black text-white shadow-card-lg transition-colors hover:bg-gray-800"
            >
              Swipe my vibe →
            </motion.button>
            <p className="text-sm font-medium text-gray-400">
              No account. No history. 30 seconds.
            </p>
          </div>

          {/* How it works */}
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.eyebrow}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.07 }}
                className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-teal">
                  {step.eyebrow}
                </p>
                <p className="mt-2 text-sm font-medium leading-5 text-gray-600">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Result examples */}
          <div className="mt-7">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
              Sample identities
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {RESULT_EXAMPLES.map((r) => (
                <span
                  key={r.label}
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-bold"
                  style={{
                    borderColor: `${r.color}33`,
                    color: r.color,
                    backgroundColor: `${r.color}0D`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Right: mock swipe preview */}
        <MockSwipePreview />
      </div>
    </div>
  );
}
