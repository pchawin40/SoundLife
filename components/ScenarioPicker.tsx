"use client";

import { motion } from "framer-motion";
import GlobalFilter from "./GlobalFilter";
import type { FilterId, Scenario } from "@/lib/types";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  filter: FilterId;
  onFilterChange: (id: FilterId) => void;
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioPicker({
  scenarios,
  filter,
  onFilterChange,
  onSelect,
}: ScenarioPickerProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-cream">
          What&apos;s the moment?
        </h2>
        <p className="mt-2 text-base text-cream/60">
          Pick the part of your day that needs a soundtrack.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {scenarios.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            className={`flex min-h-[104px] flex-col items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-brand-teal/60 hover:bg-white/10 ${
              scenario.id === "random" ? "col-span-2" : ""
            }`}
          >
            <span className="text-3xl" aria-hidden>
              {scenario.emoji}
            </span>
            <span className="mt-2">
              <span className="block text-lg font-bold leading-tight text-cream">
                {scenario.label}
              </span>
              <span className="mt-0.5 block text-xs text-cream/50">
                {scenario.tagline}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="mt-8"
      >
        <GlobalFilter value={filter} onChange={onFilterChange} />
        <p className="mt-2 text-xs text-cream/40">
          Optional — leans your tracklist toward a language or scene.
        </p>
      </motion.div>
    </div>
  );
}
