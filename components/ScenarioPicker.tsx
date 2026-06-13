"use client";

import { motion } from "framer-motion";
import GlobalFilter from "./GlobalFilter";
import type { FilterId, Scenario, ScenarioId } from "@/lib/types";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  filter: FilterId;
  onFilterChange: (id: FilterId) => void;
  onSelect: (scenario: Scenario) => void;
}

const SCENARIO_ACCENTS: Record<ScenarioId, { accent: string; prompt: string }> = {
  drive: {
    accent: "#4DB6AC",
    prompt: "windows down, eyes forward",
  },
  gym: {
    accent: "#D8552B",
    prompt: "one more rep, no witnesses",
  },
  focus: {
    accent: "#9575CD",
    prompt: "deep work with the world muted",
  },
  party: {
    accent: "#F0A82E",
    prompt: "main character at the function",
  },
  sad: {
    accent: "#E091B9",
    prompt: "feeling it, but tastefully",
  },
  chill: {
    accent: "#D9B98F",
    prompt: "low stakes, expensive calm",
  },
  random: {
    accent: "#26A69A",
    prompt: "surprise me, I contain multitudes",
  },
};

export default function ScenarioPicker({
  scenarios,
  filter,
  onFilterChange,
  onSelect,
}: ScenarioPickerProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col py-2 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-amberSoft">
            Today I need music for...
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] tracking-tight text-cream sm:text-5xl">
            Choose the scene before the algorithm guesses wrong.
          </h2>
        </div>
        <p className="max-w-xl text-base font-medium leading-7 text-cream/60 lg:justify-self-end">
          Start with the moment, then swipe the little instincts that feel true.
          The result gets sharper with every right swipe.
        </p>
      </motion.div>

      <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {scenarios.map((scenario, i) => {
          const detail = SCENARIO_ACCENTS[scenario.id];
          const isRandom = scenario.id === "random";
          return (
            <motion.button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario)}
              initial={{ opacity: 0, y: 18, rotate: i % 2 === 0 ? -0.3 : 0.3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.04 }}
              whileHover={{ y: -5, rotate: i % 2 === 0 ? -0.7 : 0.7 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className={`group relative min-h-[156px] overflow-hidden rounded-[24px] border border-white/10 bg-[#17130f] p-4 text-left shadow-card outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-brand-tealSoft sm:min-h-[174px] sm:p-5 ${
                isRandom ? "col-span-2 lg:col-span-3" : ""
              }`}
              style={{
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 22px 42px -24px ${detail.accent}66`,
              }}
            >
              <span
                className="absolute inset-x-0 top-0 h-1 opacity-90"
                style={{ backgroundColor: detail.accent }}
                aria-hidden
              />
              <span
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 opacity-30 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${detail.accent}18` }}
                aria-hidden
              />

              <span className="flex h-full flex-col justify-between gap-5">
                <span className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-card sm:h-14 sm:w-14"
                    aria-hidden
                  >
                    {scenario.emoji}
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cream/40">
                    {i + 1}
                  </span>
                </span>

                <span>
                  <span className="block text-2xl font-black leading-none tracking-tight text-cream">
                    {scenario.label}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-5 text-cream/60">
                    {scenario.tagline}
                  </span>
                  <span className="mt-3 block text-xs font-bold uppercase tracking-[0.13em] text-cream/40">
                    {detail.prompt}
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.32 }}
        className="mt-8 border-y border-white/10 py-5"
      >
        <GlobalFilter value={filter} onChange={onFilterChange} />
        <p className="mt-3 text-xs font-medium text-cream/40">
          Optional: bias the final tracklist toward a language or scene without
          emptying the result.
        </p>
      </motion.div>
    </section>
  );
}
