"use client";

import { motion } from "framer-motion";

interface LandingPageProps {
  onStart: () => void;
}

const FLOATING_EMOJI = ["🚗", "🏋️", "💻", "🎉", "😔", "😌"];

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex gap-3 text-2xl">
          {FLOATING_EMOJI.map((emoji, i) => (
            <motion.span
              key={emoji}
              aria-hidden
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <h1 className="bg-gradient-to-r from-brand-tealSoft via-cream to-brand-amberSoft bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
          SoundLife
        </h1>
        <p className="mt-4 max-w-xs text-xl font-bold leading-snug text-cream sm:max-w-sm">
          A soundtrack for every part of your day.
        </p>
        <p className="mt-3 max-w-xs text-base leading-relaxed text-cream/60 sm:max-w-sm">
          Pick a moment, swipe a few vibe cards, and find real music that fits you.
        </p>

        <motion.button
          type="button"
          onClick={onStart}
          whileTap={{ scale: 0.96 }}
          className="mt-10 min-h-[56px] rounded-2xl bg-brand-teal px-10 text-lg font-bold text-white shadow-glow transition-colors hover:bg-brand-tealSoft"
        >
          Find my sound
        </motion.button>

        <p className="mt-5 text-sm text-cream/40">
          No account. No listening history. Just your vibe.
        </p>
      </motion.div>
    </div>
  );
}
