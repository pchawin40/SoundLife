"use client";

import { GLOBAL_FILTERS } from "@/lib/data";
import type { FilterId } from "@/lib/types";

interface GlobalFilterProps {
  value: FilterId;
  onChange: (id: FilterId) => void;
}

/**
 * "Global Mode" — biases the tracklist toward a language/scene without
 * ever emptying it (the engine backfills from the global ranking).
 */
export default function GlobalFilter({ value, onChange }: GlobalFilterProps) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cream/40">
        Tune the world
      </p>
      <div
        className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="radiogroup"
        aria-label="Language filter"
      >
        {GLOBAL_FILTERS.map((filter) => {
          const active = filter.id === value;
          return (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(filter.id)}
              className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-black transition-colors ${
                active
                  ? "border-brand-teal bg-brand-teal/20 text-cream shadow-card"
                  : "border-white/10 bg-[#17130f] text-cream/60 hover:border-white/25 hover:text-cream"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
