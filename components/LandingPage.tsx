"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LandingPageProps {
  onStart: () => void;
}

const VIRAL_LINES = [
  "You’re not sad. You’re cinematic.",
  "Gym villain arc unlocked.",
  "This sounds like walking fast and ignoring texts.",
  "Your music taste has main character damage.",
  "Global heat with late-night confidence.",
];

const STEPS = [
  {
    eyebrow: "Pick a moment",
    copy: "Drive, gym, focus, party, heartbreak, chill, or full chaos.",
  },
  {
    eyebrow: "Swipe your vibe",
    copy: "Right for what feels true. Left for what misses.",
  },
  {
    eyebrow: "Get the identity",
    copy: "A shareable card plus songs that sound like the scene.",
  },
];

const MOCK_TRACKS = [
  ["After Hours", "The Weeknd"],
  ["Pursuit", "Gesaffelstein"],
  ["A Moment Apart", "ODESZA"],
];

function MockResultPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
      className="relative mx-auto w-full max-w-[430px]"
      aria-label="Example SoundLife result card"
    >
      <div
        className="absolute left-8 top-5 h-full w-[86%] rounded-[30px] border border-white/10 bg-[#221a13] shadow-card"
        aria-hidden
      />
      <div
        className="absolute -right-2 top-10 h-[88%] w-[78%] rotate-6 rounded-[30px] border border-white/10 bg-[#171411] shadow-card"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-[#17130f] p-6 shadow-card">
        <div className="absolute inset-x-0 top-0 h-1 bg-brand-amber" aria-hidden />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-cream/50">
            SoundLife result
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-cream/70">
            94% match
          </span>
        </div>

        <div className="mt-7">
          <p className="text-sm font-semibold text-brand-amberSoft">
            Your music identity
          </p>
          <h2 className="mt-2 text-4xl font-black leading-[0.98] tracking-tight text-cream sm:text-5xl">
            Main Character Damage
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key="mock-copy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-[18rem] text-base font-semibold leading-snug text-cream/70"
            >
              You’re not sad. You’re cinematic.
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-7 space-y-3">
          {[
            ["Cinematic", "92%", "bg-brand-violetSoft"],
            ["Confidence", "86%", "bg-brand-amber"],
            ["Tempo", "79%", "bg-brand-tealSoft"],
          ].map(([label, value, color]) => (
            <div key={label} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3">
              <span className="text-xs font-bold text-cream/70">{label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white/10">
                <span className={`block h-full rounded-full ${color}`} style={{ width: value }} />
              </span>
              <span className="text-right text-xs font-black tabular-nums text-cream/50">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cream/40">
            Start here
          </p>
          <div className="mt-3 space-y-2">
            {MOCK_TRACKS.map(([title, artist], i) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-black text-cream/50">
                  {i + 1}
                </span>
                <p className="min-w-0 text-sm leading-tight">
                  <span className="block truncate font-bold text-cream">{title}</span>
                  <span className="block truncate text-cream/50">{artist}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setLineIndex((i) => (i + 1) % VIRAL_LINES.length),
      2600
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full flex-1 items-center py-8 lg:min-h-[calc(100dvh-2.5rem)] lg:py-10">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#17130f]/90 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-cream/60 shadow-card">
            <span className="h-2 w-2 rounded-full bg-brand-tealSoft" aria-hidden />
            SoundLife
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.93] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            Find the playlist your mood was trying to explain.
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-cream/70 sm:text-xl">
            Swipe a few tiny truths about the moment. SoundLife turns the right
            swipes into a music identity, a shareable card, and a tracklist that
            feels less algorithmic and more “that is unfortunately me.”
          </p>

          <div className="mt-6 min-h-[36px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                className="text-base font-black text-brand-amberSoft sm:text-lg"
              >
                {VIRAL_LINES[lineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              type="button"
              onClick={onStart}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="min-h-[58px] rounded-full bg-cream px-8 text-base font-black text-ink shadow-card transition-colors hover:bg-white"
            >
              Swipe my vibe
            </motion.button>
            <p className="text-sm font-medium text-cream/50">
              No account. No listening history. Built in about 30 seconds.
            </p>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.eyebrow}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.06 }}
                className="border-l border-white/10 bg-[#17130f]/60 px-4 py-3"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cream/40">
                  {step.eyebrow}
                </p>
                <p className="mt-2 text-sm font-medium leading-5 text-cream/70">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <MockResultPreview />
      </div>
    </div>
  );
}
