"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TRAIT_META } from "@/lib/data";
import { renderShareImage } from "@/lib/share";
import type { ResultData } from "@/lib/types";

interface ShareResultCardProps {
  result: ResultData;
  scenarioEmoji: string;
  onToast: (message: string) => void;
}

export default function ShareResultCard({
  result,
  scenarioEmoji,
  onToast,
}: ShareResultCardProps) {
  const [saving, setSaving] = useState(false);
  const primary = TRAIT_META[result.traits[0].trait];
  const secondary = TRAIT_META[result.traits[1]?.trait ?? result.traits[0].trait];

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await renderShareImage(result, scenarioEmoji);
      if (!blob) {
        onToast("Couldn't render the card — try a screenshot!");
        return;
      }
      const file = new File([blob], "soundlife.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My SoundLife" });
          return;
        } catch {
          // user cancelled — fall through to download
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "soundlife.png";
      a.click();
      URL.revokeObjectURL(url);
      onToast("Card saved ✓");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto flex aspect-square w-full max-w-[410px] flex-col overflow-hidden rounded-[28px] border border-gray-100 p-6 shadow-card-lg"
        style={{
          background: `linear-gradient(145deg, ${primary.color}18 0%, #FAFAF8 40%, ${secondary.color}12 100%)`,
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-[28px]"
          style={{ background: `linear-gradient(90deg, ${primary.color}, ${secondary.color})` }}
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-400">
            SoundLife
          </span>
          <span className="text-xl" aria-hidden>
            {scenarioEmoji}
          </span>
        </div>

        <h2 className="mt-5 text-3xl font-black leading-[1.05] tracking-tight text-ink">
          {result.identity}
        </h2>

        <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-gray-700">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: primary.color }}
          />
          {result.matchPercent}% match
          {result.superVibeCount > 0 && (
            <span className="text-yellow-500">⭐</span>
          )}
        </div>

        <div className="mt-5 space-y-2">
          {result.traits.slice(0, 3).map((stat) => {
            const meta = TRAIT_META[stat.trait];
            return (
              <div key={stat.trait} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <span className="w-5 text-center" aria-hidden>{meta.emoji}</span>
                <span className="w-20">{meta.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${stat.percent}%`, backgroundColor: meta.color }}
                  />
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            On repeat
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {result.songs.slice(0, 3).map((song) => (
              <li
                key={`${song.title}-${song.artist}`}
                className="truncate text-[13px] text-gray-700"
              >
                <span className="font-bold">{song.title}</span>
                <span className="text-gray-400"> — {song.artist}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[10px] font-medium text-gray-400">
            swipe your vibe ✦ soundlife
          </p>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mx-auto mt-3 flex min-h-[46px] w-full max-w-[410px] items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? "Rendering…" : "⬇ Save / share this card"}
      </button>
    </div>
  );
}
