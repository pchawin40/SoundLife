"use client";

import { motion } from "framer-motion";
import { TRAIT_META } from "@/lib/data";
import type { TraitStat } from "@/lib/types";

interface TraitBarProps {
  stat: TraitStat;
  index: number;
}

export default function TraitBar({ stat, index }: TraitBarProps) {
  const meta = TRAIT_META[stat.trait];

  return (
    <div className="flex items-center gap-3">
      <span className="w-7 text-center text-base" aria-hidden>
        {meta.emoji}
      </span>
      <span className="w-24 shrink-0 text-sm font-semibold text-gray-600">
        {meta.label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: meta.color }}
          initial={{ width: 0 }}
          animate={{ width: `${stat.percent}%` }}
          transition={{ duration: 0.7, delay: 0.15 + index * 0.09, ease: "easeOut" }}
        />
      </div>
      <span className="w-8 text-right text-sm font-semibold tabular-nums text-gray-700">
        {stat.percent}
      </span>
    </div>
  );
}
