"use client";

import { useState, useRef } from "react";
import { GLOBAL_FILTERS } from "@/lib/data";
import type { FilterId } from "@/lib/types";

interface GlobalFilterProps {
  value: FilterId;
  onChange: (id: FilterId) => void;
}

export default function GlobalFilter({ value, onChange }: GlobalFilterProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? GLOBAL_FILTERS.filter(
        (f) =>
          f.label.toLowerCase().includes(query.toLowerCase()) ||
          f.flag?.includes(query)
      )
    : GLOBAL_FILTERS;

  const active = GLOBAL_FILTERS.find((f) => f.id === value);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
        Tune the world
      </p>

      {/* Search input */}
      <div className="relative mt-2.5 min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <span className="text-gray-400 text-sm">🔍</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search language, genre, or region..."
          className="block w-full min-w-0 rounded-2xl border border-gray-200 bg-white py-2.5 pl-8 pr-10 text-sm font-medium text-ink placeholder-gray-400 outline-none transition-colors focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="relative mt-2.5 min-w-0 overflow-hidden">
        <div
          className="flex max-w-full gap-2 overflow-x-auto pb-2 pr-7 [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
          role="radiogroup"
          aria-label="Language filter"
        >
          {filtered.map((filter) => {
            const isActive = filter.id === value;
            return (
              <button
                key={filter.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => { onChange(filter.id); setQuery(""); }}
                className={`min-h-[38px] max-w-[180px] shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-all sm:max-w-none ${
                  isActive
                    ? "border-brand-teal bg-brand-teal text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-teal/40 hover:text-brand-teal"
                }`}
              >
                <span className="block truncate">
                  {filter.flag} {filter.label}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-2 text-sm text-gray-400">No matches for "{query}"</p>
          )}
        </div>
      </div>

      {/* Active filter summary */}
      {active && active.id !== "global" && (
        <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-2">
          <span className="min-w-0 text-xs font-semibold leading-5 text-brand-teal">
            ✓ Boosting {active.flag} {active.label} songs — blends globally so results never empty
          </span>
          <button
            type="button"
            onClick={() => onChange("global")}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
