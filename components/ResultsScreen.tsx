"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShareResultCard from "./ShareResultCard";
import SongCard from "./SongCard";
import TraitBar from "./TraitBar";
import { TRAIT_META, TRAIT_VERDICTS } from "@/lib/data";
import { getFilter } from "@/lib/engine";
import { buildShareText, copyToClipboard } from "@/lib/share";
import type { Catalog, ResultData, Song } from "@/lib/types";

interface ResultsScreenProps {
  result: ResultData;
  catalog: Catalog;
  onRedo: () => void;
}

interface SongGroup {
  title: "Start here" | "Wildcard" | "Deep cut";
  kicker: string;
  songs: Song[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-cream/40">
      {children}
    </h3>
  );
}

function identityCopy(result: ResultData, scenarioLabel?: string): string {
  const topTrait = result.traits[0]?.trait;
  if (result.filterId !== "global") {
    return "Global heat with late-night confidence. The playlist keeps the flavor specific without making the room smaller.";
  }
  if (result.scenarioId === "gym") {
    return "Gym villain arc unlocked. This is high-stakes cardio for people who treat the final rep like a plot twist.";
  }
  if (result.scenarioId === "sad") {
    return "You’re not sad. You’re cinematic. The feelings are real, but the lighting is excellent.";
  }
  if (topTrait === "tempo" || result.identity.toLowerCase().includes("heart rate")) {
    return "This sounds like walking fast and ignoring texts. Efficient, focused, slightly dangerous.";
  }
  if (topTrait === "confidence" || topTrait === "cinematic") {
    return "Your music taste has main character damage. The soundtrack arrived before the character development did.";
  }
  return `This is ${scenarioLabel?.toLowerCase() ?? "the moment"} music with a point of view: specific enough to screenshot, broad enough to actually play.`;
}

function groupSongs(songs: Song[]): SongGroup[] {
  const groups: SongGroup[] = [
    {
      title: "Start here",
      kicker: "The cleanest entry point into the identity.",
      songs: songs.slice(0, 3),
    },
    {
      title: "Wildcard",
      kicker: "A left turn that still makes emotional sense.",
      songs: songs.slice(3, 6),
    },
    {
      title: "Deep cut",
      kicker: "For when the result starts getting too accurate.",
      songs: songs.slice(6),
    },
  ];

  return groups.filter((group) => group.songs.length > 0);
}

function songNote(song: Song, group: SongGroup["title"], identity: string): string {
  const leadChip = song.chips[0]?.label.toLowerCase();
  const detail = leadChip ? `the ${leadChip} edge` : "the emotional center";

  if (group === "Start here") {
    return `The on-ramp: ${song.artist} gives ${identity.toLowerCase()} ${detail} without overexplaining it.`;
  }
  if (group === "Wildcard") {
    return `The curveball: it bends the mood sideways, then somehow makes the whole result feel more personal.`;
  }
  return `The late-save: keep this for the moment the obvious picks stop being enough.`;
}

export default function ResultsScreen({
  result,
  catalog,
  onRedo,
}: ResultsScreenProps) {
  const [toast, setToast] = useState<string | null>(null);
  const scenario = catalog.scenarios.find((s) => s.id === result.scenarioId);
  const filter = getFilter(result.filterId);
  const verdict = TRAIT_VERDICTS[result.traits[0].trait];
  const copy = identityCopy(result, scenario?.label);
  const songGroups = useMemo(() => groupSongs(result.songs), [result.songs]);
  const topTrait = TRAIT_META[result.traits[0].trait];

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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pb-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs font-black uppercase tracking-[0.22em] text-cream/40"
      >
        Your SoundLife · {scenario?.emoji} {scenario?.label}
        {filter.id !== "global" && ` · ${filter.label} heat`}
      </motion.p>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(320px,410px)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-6">
          <ShareResultCard
            result={result}
            scenarioEmoji={scenario?.emoji ?? "🎧"}
            onToast={setToast}
          />
        </div>

        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-amberSoft">
              Your music identity
            </p>
            <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-tight text-cream sm:text-5xl">
              {result.identity}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-cream/70">
              {copy}
            </p>

            <div
              className="mt-5 border-l-2 bg-[#17130f]/75 px-4 py-3"
              style={{ borderColor: topTrait.color }}
            >
              <p className="text-sm font-black italic leading-6 text-cream">
                “{verdict}”
              </p>
            </div>
          </motion.div>

          {result.likedCount === 0 && (
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-cream/60">
              You passed on every card. Respect. This is pure{" "}
              {scenario?.label.toLowerCase()} energy, no extra seasoning.
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyShare}
              className="min-h-[54px] rounded-full bg-cream px-5 text-sm font-black text-ink shadow-card transition-colors hover:bg-white active:scale-95"
            >
              Copy my SoundLife
            </button>
            <button
              type="button"
              onClick={onRedo}
              className="min-h-[54px] rounded-full border border-white/15 bg-[#17130f]/90 px-5 text-sm font-black text-cream transition-colors hover:bg-white/10 active:scale-95"
            >
              Redo vibe
            </button>
          </div>

          <section className="mt-10">
            <SectionTitle>Your sound profile</SectionTitle>
            <div className="mt-4 space-y-3.5 rounded-2xl border border-white/10 bg-[#17130f] p-4">
              {result.traits.map((stat, i) => (
                <TraitBar key={stat.trait} stat={stat} index={i} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <SectionTitle>The tracklist</SectionTitle>
              <span className="text-xs font-semibold text-cream/40">
                Spotify · YouTube Music · Apple Music
              </span>
            </div>

            {songGroups.length > 0 ? (
              <div className="mt-5 space-y-8">
                {songGroups.map((group) => (
                  <div key={group.title}>
                    <div className="mb-3">
                      <h4 className="text-2xl font-black tracking-tight text-cream">
                        {group.title}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-cream/50">
                        {group.kicker}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {group.songs.map((song, i) => {
                        const rank = result.songs.findIndex((s) => s.id === song.id) + 1;
                        return (
                          <motion.div
                            key={song.id}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                              duration: 0.35,
                              delay: Math.min(i * 0.04, 0.2),
                            }}
                          >
                            <SongCard
                              song={song}
                              rank={rank}
                              resultIdentity={result.identity}
                              note={songNote(song, group.title, result.identity)}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cream/60">
                Hmm, no tracks matched that combination. Hit “Redo vibe” and
                try another mix.
              </p>
            )}
          </section>

          <section className="mt-10">
            <SectionTitle>Artists to fall into</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.artists.map((artist) => (
                <span
                  key={artist}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cream/80"
                >
                  {artist}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-3">
              <SectionTitle>Name your playlist</SectionTitle>
              <span className="text-xs text-cream/40">tap to copy</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {result.playlists.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCopyPlaylist(name)}
                  className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#17130f] px-4 text-left text-sm font-semibold text-cream/80 transition-colors hover:bg-white/10 active:scale-[0.98]"
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
        </div>
      </div>

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
