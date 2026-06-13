"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TRAIT_META } from "@/lib/data";
import type { IdentityRarity, ResultData } from "@/lib/types";

interface RevealOverlayProps {
  result: ResultData;
  rarity: IdentityRarity;
  scenarioEmoji: string;
  onDone: () => void;
}

const RARITY_HEX: Record<IdentityRarity, string> = {
  common: "#D4D4D8",
  uncommon: "#2DD4BF",
  rare: "#C084FC",
  legendary: "#FBBF24",
};

const RARITY_LABEL: Record<IdentityRarity, string> = {
  common: "Common find",
  uncommon: "Uncommon find",
  rare: "Rare find",
  legendary: "Legendary find",
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function RevealOverlay({
  result,
  rarity,
  scenarioEmoji,
  onDone,
}: RevealOverlayProps) {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const done = useRef(false);
  const theme = result.archetype.colorTheme;
  const primary = TRAIT_META[result.traits[0].trait];
  const rarityColor = RARITY_HEX[rarity];

  const finish = () => {
    if (done.current) return;
    done.current = true;
    onDone();
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase(3);
      setCount(result.matchPercent);
      const t = window.setTimeout(finish, 600);
      return () => window.clearTimeout(t);
    }
    const timers = [
      window.setTimeout(() => setPhase(1), 650),
      window.setTimeout(() => setPhase(2), 1450),
      window.setTimeout(() => setPhase(3), 2400),
      window.setTimeout(finish, 3300),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count-up for the match score once it's revealed.
  useEffect(() => {
    if (phase < 2) return;
    const target = result.matchPercent;
    const start = performance.now();
    const duration = 850;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, result.matchPercent]);

  return (
    <motion.div
      role="dialog"
      aria-label={`Your sound identity: ${result.identity}`}
      className="fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center overflow-hidden px-7 text-center"
      style={{ backgroundColor: theme.background, color: theme.text }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      onClick={finish}
    >
      {/* Glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 18%, ${theme.accent}55, transparent 55%), radial-gradient(circle at 80% 95%, ${primary.color}33, transparent 50%)`,
        }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl"
        >
          {result.archetype.emoji || scenarioEmoji}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-xs font-black uppercase tracking-[0.32em]"
          style={{ color: theme.text }}
        >
          Your sound identity
        </motion.p>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.h1
              initial={{ opacity: 0, scale: 1.18, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[12ch] text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl"
            >
              {result.identity}
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-7 flex items-center gap-4"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tabular-nums" style={{ color: primary.color }}>
                  {count}
                </span>
                <span className="text-lg font-black" style={{ color: primary.color }}>
                  %
                </span>
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">
                match
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.15 }}
              className="mt-6 rounded-2xl border-2 px-5 py-2"
              style={{
                borderColor: rarityColor,
                color: rarityColor,
                backgroundColor: `${rarityColor}1A`,
              }}
            >
              <span className="text-base font-black uppercase tracking-[0.16em]">
                ✦ {RARITY_LABEL[rarity]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase >= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="absolute bottom-10 text-xs font-bold uppercase tracking-[0.28em]"
            style={{ color: theme.text }}
          >
            Tap to reveal your tracklist
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
