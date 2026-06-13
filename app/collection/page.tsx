"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TRAIT_META } from "@/lib/data";
import { getStorageJson } from "@/lib/storage";
import { EMPTY_PROFILE_STATE } from "@/lib/streak";
import type { IdentityRarity, SoundLifeCollectionItem, SoundLifeProfileState } from "@/lib/types";

type RarityFilter = "all" | IdentityRarity;

const RARITY_ORDER: IdentityRarity[] = ["legendary", "rare", "uncommon", "common"];

const RARITY_STYLE: Record<IdentityRarity, { badge: string; card: string }> = {
  common: {
    badge: "border-gray-200 bg-gray-100 text-gray-600",
    card: "border-gray-100",
  },
  uncommon: {
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    card: "border-teal-100",
  },
  rare: {
    badge: "border-purple-200 bg-purple-50 text-purple-700",
    card: "border-purple-100",
  },
  legendary: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    card: "border-amber-100",
  },
};

function rarityCounts(items: SoundLifeCollectionItem[]): Record<IdentityRarity, number> {
  const counts: Record<IdentityRarity, number> = { common: 0, uncommon: 0, rare: 0, legendary: 0 };
  items.forEach((item) => { counts[item.rarity]++; });
  return counts;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function CollectionPage() {
  const [profile, setProfile] = useState<SoundLifeProfileState>(EMPTY_PROFILE_STATE);
  const [filter, setFilter] = useState<RarityFilter>("all");

  useEffect(() => {
    setProfile(getStorageJson("profile", EMPTY_PROFILE_STATE));
  }, []);

  const { collection } = profile;
  const counts = rarityCounts(collection);

  const filtered = collection
    .filter((item) => filter === "all" || item.rarity === filter)
    .sort((a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime());

  const filterOptions: Array<{ id: RarityFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: collection.length },
    ...RARITY_ORDER.map((r) => ({ id: r as RarityFilter, label: r.charAt(0).toUpperCase() + r.slice(1), count: counts[r] })),
  ];

  return (
    <main className="app-surface min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-5 py-8 sm:px-7">
        {/* Header */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-surface text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Home"
          >
            ←
          </a>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-amber">SoundLife</p>
            <h1 className="text-2xl font-black leading-none tracking-tight text-ink">
              Identity Collection
            </h1>
          </div>
        </div>

        {/* Rarity summary */}
        {collection.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {RARITY_ORDER.map((rarity) => (
              <div
                key={rarity}
                className={`rounded-2xl border p-4 ${RARITY_STYLE[rarity].card} bg-surface shadow-sm`}
              >
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${RARITY_STYLE[rarity].badge}`}>
                  {rarity}
                </span>
                <p className="mt-2 text-2xl font-black text-ink">{counts[rarity]}</p>
                <p className="text-xs font-semibold text-gray-400">
                  {counts[rarity] === 1 ? "identity" : "identities"}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filter tabs */}
        {collection.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-black transition-colors ${
                  filter === opt.id
                    ? "border-ink bg-ink text-paper"
                    : "border-gray-200 bg-surface text-gray-600 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                {opt.label}
                {opt.count > 0 && (
                  <span className={`ml-1.5 ${filter === opt.id ? "text-paper/60" : "text-gray-400"}`}>
                    {opt.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="mt-6 flex-1">
          {collection.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <p className="text-4xl">🎧</p>
              <p className="mt-4 text-lg font-black text-ink">No identities yet</p>
              <p className="mt-2 max-w-xs text-sm font-medium leading-6 text-gray-500">
                Swipe once and SoundLife starts collecting your extremely specific musical eras.
              </p>
              <a
                href="/"
                className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-black text-paper transition-colors hover:bg-gray-800"
              >
                Start swiping
              </a>
            </motion.div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm font-medium text-gray-400">
              No {filter} identities discovered yet. Keep swiping.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.sharePath}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.18) }}
                  className={`group rounded-2xl border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-lg ${RARITY_STYLE[item.rarity].card}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${RARITY_STYLE[item.rarity].badge}`}>
                      {item.rarity}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {formatDate(item.discoveredAt)}
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-black leading-tight tracking-tight text-ink">
                    {item.identity}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      {item.topTraits.slice(0, 3).map((trait) => (
                        <span key={trait} className="text-base" title={TRAIT_META[trait].label}>
                          {TRAIT_META[trait].emoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {item.matchPercent}% match
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    {item.scenarioId}
                  </p>
                </motion.a>
              ))}
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-gray-400">
          SoundLife · your collection lives in this browser only
        </p>
      </div>
    </main>
  );
}
