"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShareCard from "./ShareCard";
import SongCard from "./SongCard";
import TraitBar from "./TraitBar";
import { SCENARIOS } from "@/lib/data";
import { buildShareText, copyToClipboard } from "@/lib/share";
import type { ResultData } from "@/lib/types";

interface ResultsScreenProps {
  result: ResultData;
  onRedo: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-cream/45">
      {children}
    </h3>
  );
}

export default function ResultsScreen({ result, onRedo }: ResultsScreenProps) {
  const [toast, setToast] = useState<string | null>(null);
  const scenario = SCENARIOS.find((s) => s.id === result.scenarioId);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleCopyShare = async () => {
    const ok = await copyToClipboard(buildShareText(result));
    setToast(ok ? "Copied to clipboard ✓" : "Couldn't copy — try a screenshot!");
  };

  const handleCopyPlaylist = async (name: string) => {
    const ok = await copyToClipboard(name);
    setToast(ok ? `"${name}" copied ✓` : "Couldn't copy");
  };

  return (
    <div className="flex w-full flex-1 flex-col pb-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs font-black uppercase tracking-[0.22em] text-cream/45"
      >
        Your SoundLife · {scenario?.emoji} {scenario?.label}
      </motion.p>

      <div className="mt-4">
        <ShareCard result={result} />
      </div>

      {result.likedCount === 0 && (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-cream/60">
          You passed on every card — respect. This is pure{" "}
          {scenario?.label.toLowerCase()} energy, no extra seasoning.
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleCopyShare}
          className="min-h-[52px] flex-1 rounded-2xl bg-brand-teal px-4 text-sm font-bold text-white shadow-glow transition-colors hover:bg-brand-tealSoft active:scale-95"
        >
          Copy my SoundLife
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="min-h-[52px] flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-cream transition-colors hover:bg-white/10 active:scale-95"
        >
          Redo vibe
        </button>
      </div>

      {/* Trait profile */}
      <section className="mt-10">
        <SectionTitle>Your sound profile</SectionTitle>
        <div className="mt-4 space-y-3.5 rounded-2xl border border-white/10 bg-white/5 p-4">
          {result.traits.map((stat, i) => (
            <TraitBar key={stat.trait} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* Songs */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <SectionTitle>Your top 10 tracks</SectionTitle>
          <span className="text-xs text-cream/40">tap a platform to listen</span>
        </div>
        {result.songs.length > 0 ? (
          <div className="mt-4 space-y-3">
            {result.songs.map((song, i) => (
              <motion.div
                key={`${song.title}-${song.artist}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
              >
                <SongCard song={song} rank={i + 1} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cream/60">
            Hmm, no tracks matched that combination. Hit “Redo vibe” and try
            another mix.
          </p>
        )}
      </section>

      {/* Artists */}
      <section className="mt-10">
        <SectionTitle>Artists for you</SectionTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.artists.map((artist) => (
            <span
              key={artist}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cream/85"
            >
              {artist}
            </span>
          ))}
        </div>
      </section>

      {/* Playlist names */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <SectionTitle>Playlist name ideas</SectionTitle>
          <span className="text-xs text-cream/40">tap to copy</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {result.playlists.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleCopyPlaylist(name)}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-left text-sm font-semibold text-cream/85 transition-colors hover:bg-white/10 active:scale-[0.98]"
            >
              <span aria-hidden>🎧</span>
              {name}
            </button>
          ))}
        </div>
      </section>

      <p className="mt-12 text-center text-xs text-cream/30">
        SoundLife · swipe your vibe ✦ no accounts, no tracking
      </p>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#211C17] px-5 py-2.5 text-sm font-semibold text-cream shadow-card"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
