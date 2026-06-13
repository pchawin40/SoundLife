"use client";

import { motion } from "framer-motion";
import GlobalFilter from "./GlobalFilter";
import type { FilterId, RoastIntensity, Scenario, ScenarioId } from "@/lib/types";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  filter: FilterId;
  roastIntensity: RoastIntensity;
  deckLength: number;
  onFilterChange: (id: FilterId) => void;
  onRoastIntensityChange: (intensity: RoastIntensity) => void;
  onDeckLengthChange: (n: number) => void;
  onSelect: (scenario: Scenario) => void;
}

const SCENARIO_ACCENTS: Record<ScenarioId, { accent: string; bg: string; prompt: string }> = {
  drive: {
    accent: "#0D9488",
    bg: "#F0FDFA",
    prompt: "windows down, eyes forward",
  },
  gym: {
    accent: "#DC2626",
    bg: "#FEF2F2",
    prompt: "one more rep, no witnesses",
  },
  focus: {
    accent: "#7C3AED",
    bg: "#F5F3FF",
    prompt: "deep work with the world muted",
  },
  party: {
    accent: "#D97706",
    bg: "#FFFBEB",
    prompt: "main character at the function",
  },
  sad: {
    accent: "#DB2777",
    bg: "#FDF2F8",
    prompt: "feeling it, but tastefully",
  },
  chill: {
    accent: "#0891B2",
    bg: "#F0F9FF",
    prompt: "low stakes, expensive calm",
  },
  random: {
    accent: "#6366F1",
    bg: "#EEF2FF",
    prompt: "surprise me, I contain multitudes",
  },
};

export default function ScenarioPicker({
  scenarios,
  filter,
  roastIntensity,
  deckLength,
  onFilterChange,
  onRoastIntensityChange,
  onDeckLengthChange,
  onSelect,
}: ScenarioPickerProps) {
  const roastOptions: Array<{ id: RoastIntensity; label: string; note: string }> = [
    { id: "soft", label: "Soft", note: "gentle diagnosis" },
    { id: "accurate", label: "Accurate", note: "call it clean" },
    { id: "roast", label: "Roast me", note: "no mercy" },
  ];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col py-2 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-amber">
            Today I need music for...
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] tracking-tight text-ink sm:text-5xl">
            Choose the scene before the algorithm guesses wrong.
          </h2>
        </div>
        <p className="max-w-xl text-base font-medium leading-7 text-muted lg:justify-self-end">
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
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className={`group relative min-h-[164px] overflow-hidden rounded-[24px] border border-gray-100 bg-surface p-5 text-left shadow-card outline-none transition-all hover:shadow-card-lg focus-visible:ring-2 focus-visible:ring-brand-teal/40 sm:min-h-[184px] ${
                isRandom ? "col-span-2 lg:col-span-3" : ""
              }`}
            >
              {/* Accent top bar */}
              <span
                className="absolute inset-x-0 top-0 h-1 rounded-t-[24px]"
                style={{ backgroundColor: detail.accent }}
                aria-hidden
              />
              {/* Background tint */}
              <span
                className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70"
                style={{ background: `radial-gradient(ellipse at top right, ${detail.accent}18, transparent 70%)` }}
                aria-hidden
              />

              <span className="relative flex h-full flex-col justify-between gap-4">
                <span className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border text-3xl shadow-sm sm:h-14 sm:w-14"
                    style={{ borderColor: `${detail.accent}30`, backgroundColor: `${detail.accent}1A` }}
                    aria-hidden
                  >
                    {scenario.emoji}
                  </span>
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
                    style={{ borderColor: `${detail.accent}30`, color: detail.accent, backgroundColor: `${detail.accent}10` }}
                  >
                    {i + 1}
                  </span>
                </span>

                <span>
                  <span className="block text-2xl font-black leading-none tracking-tight text-ink">
                    {scenario.label}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-5 text-muted">
                    {scenario.tagline}
                  </span>
                  <span
                    className="mt-2.5 block text-xs font-bold uppercase tracking-[0.13em]"
                    style={{ color: detail.accent }}
                  >
                    {detail.prompt}
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Filter section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.32 }}
        className="mt-8 rounded-2xl border border-gray-100 bg-surface p-5 shadow-sm"
      >
        <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] lg:items-start">
          <div className="min-w-0 overflow-hidden">
            <GlobalFilter value={filter} onChange={onFilterChange} />
            <p className="mt-3 text-xs font-medium text-gray-400">
              Optional: bias the final tracklist toward a language or scene.
              Results never go empty — global songs backfill the rest.
            </p>
          </div>

          <div className="min-w-0 space-y-5">
            {/* Deck length */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                Deck size
              </p>
              <div
                className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5"
                role="radiogroup"
                aria-label="Deck size"
              >
                {([5, 10] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={deckLength === n}
                    onClick={() => onDeckLengthChange(n)}
                    className={`min-h-[44px] rounded-xl px-2 text-center text-xs font-black transition-all ${
                      deckLength === n
                        ? "bg-ink text-paper shadow-sm"
                        : "bg-transparent text-gray-500 hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span className="block">{n === 5 ? "Quick" : "Full"}</span>
                    <span
                      className={`mt-0.5 block text-[10px] font-bold ${
                        deckLength === n ? "text-paper/60" : "text-gray-400"
                      }`}
                    >
                      {n} cards
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-gray-400">
                Quick gives a faster but less precise identity.
              </p>
            </div>

            <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
              Result tone
            </p>
            <div
              className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5"
              role="radiogroup"
              aria-label="Result tone"
            >
              {roastOptions.map((option) => {
                const active = roastIntensity === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onRoastIntensityChange(option.id)}
                    className={`min-h-[54px] rounded-xl px-2 text-center text-xs font-black transition-all ${
                      active
                        ? "bg-ink text-paper shadow-sm"
                        : "bg-transparent text-gray-500 hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span className="block">{option.label}</span>
                    <span
                      className={`mt-1 block text-[10px] font-bold ${
                        active ? "text-paper/60" : "text-gray-400"
                      }`}
                    >
                      {option.note}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs font-medium text-gray-400">
              Choose how directly SoundLife is allowed to talk about you.
            </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
