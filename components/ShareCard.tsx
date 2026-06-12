"use client";

import { motion } from "framer-motion";
import { SCENARIOS, TRAIT_META } from "@/lib/data";
import type { ResultData } from "@/lib/types";

interface ShareCardProps {
  result: ResultData;
}

export default function ShareCard({ result }: ShareCardProps) {
  const scenario = SCENARIOS.find((s) => s.id === result.scenarioId);
  const primary = TRAIT_META[result.traits[0].trait];
  const secondary = TRAIT_META[result.traits[1]?.trait ?? result.traits[0].trait];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border border-white/15 p-6 shadow-card"
      style={{
        background: `linear-gradient(140deg, ${primary.color}40 0%, ${secondary.color}26 45%, rgba(22,18,14,0.2) 75%), #16120E`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cream/60">
          SoundLife
        </span>
        <span className="text-xl" aria-hidden>
          {scenario?.emoji}
        </span>
      </div>

      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl">
        {result.identity}
      </h2>

      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-cream">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: primary.color }}
        />
        {result.matchPercent}% match
      </div>

      <p className="mt-4 text-sm font-semibold text-cream/80">
        {result.traits.slice(0, 3).map((stat, i) => (
          <span key={stat.trait}>
            {i > 0 && <span className="mx-1.5 text-cream/30">·</span>}
            <span aria-hidden>{TRAIT_META[stat.trait].emoji}</span>{" "}
            {TRAIT_META[stat.trait].label} {stat.percent}
          </span>
        ))}
      </p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/40">
          On repeat
        </p>
        <ul className="mt-2 space-y-1">
          {result.songs.slice(0, 3).map((song) => (
            <li key={`${song.title}-${song.artist}`} className="truncate text-sm text-cream/85">
              <span className="font-bold">{song.title}</span>
              <span className="text-cream/50"> — {song.artist}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 text-[11px] font-medium text-cream/35">
        swipe your vibe ✦ soundlife
      </p>
    </motion.div>
  );
}
