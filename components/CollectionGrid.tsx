"use client";

import { TRAIT_META } from "@/lib/data";
import type { IdentityRarity, SoundLifeCollectionItem } from "@/lib/types";

interface CollectionGridProps {
  items: SoundLifeCollectionItem[];
  limit?: number;
}

const RARITY_STYLE: Record<IdentityRarity, string> = {
  common: "border-gray-200 bg-gray-50 text-gray-500",
  uncommon: "border-teal-200 bg-teal-50 text-teal-700",
  rare: "border-purple-200 bg-purple-50 text-purple-700",
  legendary: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function CollectionGrid({ items, limit = 6 }: CollectionGridProps) {
  const visible = items.slice(0, limit);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
            Identity collection
          </p>
          <h3 className="mt-1 text-lg font-black text-ink">
            {items.length > 0 ? `${items.length} discovered` : "No identities yet"}
          </h3>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {visible.map((item) => (
            <a
              key={item.id}
              href={item.sharePath}
              className="min-w-0 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-white"
            >
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${RARITY_STYLE[item.rarity]}`}
              >
                {item.rarity}
              </span>
              <p className="mt-2 line-clamp-2 text-sm font-black leading-4 text-ink">
                {item.identity}
              </p>
              <div className="mt-2 flex gap-1">
                {item.topTraits.slice(0, 3).map((trait) => (
                  <span key={trait} className="text-sm" title={TRAIT_META[trait].label}>
                    {TRAIT_META[trait].emoji}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
          Swipe once and SoundLife starts collecting your extremely specific eras.
        </p>
      )}
    </section>
  );
}
