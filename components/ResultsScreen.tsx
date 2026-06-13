"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShareResultCard from "./ShareResultCard";
import SongCard from "./SongCard";
import TraitBar from "./TraitBar";
import { TRAIT_META, TRAIT_VERDICTS } from "@/lib/data";
import { getFilter } from "@/lib/engine";
import { buildShareText, copyToClipboard } from "@/lib/share";
import { getPlatformLinks } from "@/lib/platforms";
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
    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
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
    return "You're not sad. You're cinematic. The feelings are real, but the lighting is excellent.";
  }
  if (topTrait === "tempo" || result.identity.toLowerCase().includes("heart rate")) {
    return "This sounds like walking fast and ignoring texts. Efficient, focused, slightly dangerous.";
  }
  if (topTrait === "confidence" || topTrait === "cinematic") {
    return "Your music taste has main character damage. The soundtrack arrived before the character development did.";
  }
  if (topTrait === "romance") {
    return "Lovesick, but make it a full cinematic score. The feelings are real and the tracklist knows it.";
  }
  if (result.superVibeCount > 0) {
    return `${result.superVibeCount} super vibe${result.superVibeCount > 1 ? "s" : ""} registered. This result knows exactly what you're about — and agreed with you.`;
  }
  return `This is ${scenarioLabel?.toLowerCase() ?? "the moment"} music with a point of view: specific enough to screenshot, broad enough to actually play.`;
}

function groupSongs(songs: Song[]): SongGroup[] {
  return (
    [
      { title: "Start here" as const, kicker: "The cleanest entry point into the identity.", songs: songs.slice(0, 3) },
      { title: "Wildcard" as const, kicker: "A left turn that still makes emotional sense.", songs: songs.slice(3, 6) },
      { title: "Deep cut" as const, kicker: "For when the result starts getting too accurate.", songs: songs.slice(6) },
    ] as SongGroup[]
  ).filter((g) => g.songs.length > 0);
}

function songNote(song: Song, group: SongGroup["title"], identity: string): string {
  const leadChip = song.chips[0]?.label.toLowerCase();
  const detail = leadChip ? `the ${leadChip} edge` : "the emotional center";
  if (group === "Start here") return `The on-ramp: ${song.artist} gives ${identity.toLowerCase()} ${detail} without overexplaining it.`;
  if (group === "Wildcard") return "The curveball: it bends the mood sideways, then somehow makes the whole result feel more personal.";
  return "The late-save: keep this for the moment the obvious picks stop being enough.";
}

/* ── Playlist mode ── */
function PlaylistMode({ result }: { result: ResultData }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    const ok = await copyToClipboard(text);
    if (ok) { setCopied(label); setTimeout(() => setCopied(null), 1800); }
  };

  const spotifySearches = result.songs
    .map((s) => `Spotify: ${s.title} – ${s.artist}`)
    .join("\n");
  const ytSearches = result.songs
    .map((s) => `YouTube: ${s.title} ${s.artist}`)
    .join("\n");
  const appleMusicSearches = result.songs
    .map((s) => `Apple Music: ${s.title} ${s.artist}`)
    .join("\n");
  const playlistText = `${result.identity}\n\n${result.songs
    .map((s, i) => `${i + 1}. ${s.title} — ${s.artist}`)
    .join("\n")}`;

  const firstSpotify = result.songs[0]
    ? getPlatformLinks(result.songs[0])[0]?.href
    : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-black text-ink">Playlist Mode</h4>
          <p className="text-sm text-gray-500">All 10 songs, ready to export</p>
        </div>
        <span className="rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
          {result.songs.length} tracks
        </span>
      </div>

      {/* Track list */}
      <ol className="mt-4 space-y-1.5">
        {result.songs.map((song, i) => (
          <li key={song.id} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-right text-xs font-black tabular-nums text-gray-300">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">{song.title}</span>
              <span className="block truncate text-xs text-gray-400">{song.artist}</span>
            </div>
            {song.language !== "english" && song.language !== "instrumental" && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 capitalize">
                {song.language}
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Export buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => copy(playlistText, "playlist")}
          className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
        >
          {copied === "playlist" ? "✓ Copied" : "📋 Copy playlist"}
        </button>
        <button
          type="button"
          onClick={() => copy(spotifySearches, "spotify")}
          className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-green-100 bg-green-50 px-3 text-xs font-bold text-green-700 transition-colors hover:bg-green-100 active:scale-95"
        >
          {copied === "spotify" ? "✓ Copied" : "🟢 Spotify searches"}
        </button>
        <button
          type="button"
          onClick={() => copy(ytSearches, "youtube")}
          className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 active:scale-95"
        >
          {copied === "youtube" ? "✓ Copied" : "▶ YT Music searches"}
        </button>
        <button
          type="button"
          onClick={() => copy(appleMusicSearches, "apple")}
          className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-pink-100 bg-pink-50 px-3 text-xs font-bold text-pink-700 transition-colors hover:bg-pink-100 active:scale-95"
        >
          {copied === "apple" ? "✓ Copied" : "🍎 Apple searches"}
        </button>
      </div>

      {/* Open first song */}
      {firstSpotify && (
        <a
          href={firstSpotify}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 active:scale-95"
        >
          ▶ Open first song on Spotify
        </a>
      )}

      {/* Coming soon CTAs */}
      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="flex min-h-[40px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-green-200 bg-green-50/50 px-4 text-xs font-bold text-green-400"
        >
          🟢 Create Spotify playlist — coming soon (requires login)
        </button>
        <button
          type="button"
          disabled
          className="flex min-h-[40px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-red-200 bg-red-50/50 px-4 text-xs font-bold text-red-400"
        >
          ▶ Create YouTube playlist — coming soon (requires login)
        </button>
      </div>
    </div>
  );
}

export default function ResultsScreen({ result, catalog, onRedo }: ResultsScreenProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
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
        className="text-center text-xs font-black uppercase tracking-[0.22em] text-gray-400"
      >
        Your SoundLife · {scenario?.emoji} {scenario?.label}
        {filter.id !== "global" && ` · ${filter.flag} ${filter.label} heat`}
        {result.superVibeCount > 0 && ` · ⭐ ${result.superVibeCount} super`}
      </motion.p>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(320px,410px)_minmax(0,1fr)] lg:items-start">
        {/* Left: share card */}
        <div className="lg:sticky lg:top-6">
          <ShareResultCard
            result={result}
            scenarioEmoji={scenario?.emoji ?? "🎧"}
            onToast={setToast}
          />
        </div>

        {/* Right: content */}
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-amber">
              Your music identity
            </p>
            <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-tight text-ink sm:text-5xl">
              {result.identity}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-gray-600">
              {copy}
            </p>

            {/* Verdict */}
            <div
              className="mt-5 rounded-2xl border-l-2 bg-gray-50 px-4 py-3"
              style={{ borderColor: topTrait.color }}
            >
              <p className="text-sm font-black italic leading-6 text-ink">
                "{verdict}"
              </p>
            </div>
          </motion.div>

          {result.likedCount === 0 && (
            <p className="mt-5 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-500 shadow-sm">
              You passed on every card. Respect. This is pure{" "}
              {scenario?.label.toLowerCase()} energy, no extra seasoning.
            </p>
          )}

          {/* CTA buttons */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyShare}
              className="min-h-[54px] rounded-full bg-ink px-5 text-sm font-black text-white shadow-card transition-colors hover:bg-gray-800 active:scale-95"
            >
              Copy my SoundLife
            </button>
            <button
              type="button"
              onClick={onRedo}
              className="min-h-[54px] rounded-full border border-gray-200 bg-white px-5 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 active:scale-95"
            >
              Redo vibe
            </button>
          </div>

          {/* Sound profile */}
          <section className="mt-10">
            <SectionTitle>Your sound profile</SectionTitle>
            <div className="mt-4 space-y-3.5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {result.traits.map((stat, i) => (
                <TraitBar key={stat.trait} stat={stat} index={i} />
              ))}
            </div>
          </section>

          {/* Playlist mode toggle */}
          <section className="mt-10">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>Playlist Mode</SectionTitle>
              <button
                type="button"
                onClick={() => setShowPlaylist((v) => !v)}
                className={`rounded-full border px-4 py-1.5 text-xs font-black transition-colors ${
                  showPlaylist
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-teal/30"
                }`}
              >
                {showPlaylist ? "▲ Hide" : "▼ View playlist"}
              </button>
            </div>
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <PlaylistMode result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Tracklist */}
          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <SectionTitle>The tracklist</SectionTitle>
              <span className="text-xs font-semibold text-gray-400">
                Spotify · YouTube Music · Apple Music
              </span>
            </div>

            {songGroups.length > 0 ? (
              <div className="mt-5 space-y-8">
                {songGroups.map((group) => (
                  <div key={group.title}>
                    <div className="mb-3">
                      <h4 className="text-2xl font-black tracking-tight text-ink">
                        {group.title}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-gray-400">{group.kicker}</p>
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
                            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
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
              <p className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                Hmm, no tracks matched that combination. Hit "Redo vibe" and try another mix.
              </p>
            )}
          </section>

          {/* Artists */}
          <section className="mt-10">
            <SectionTitle>Artists to fall into</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.artists.map((artist) => (
                <span
                  key={artist}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
                >
                  {artist}
                </span>
              ))}
            </div>
          </section>

          {/* Playlist names */}
          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-3">
              <SectionTitle>Name your playlist</SectionTitle>
              <span className="text-xs text-gray-400">tap to copy</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {result.playlists.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCopyPlaylist(name)}
                  className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 text-left text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98]"
                >
                  <span aria-hidden>🎧</span>
                  {name}
                </button>
              ))}
            </div>
          </section>

          <p className="mt-12 text-center text-xs text-gray-400">
            SoundLife · swipe your vibe ✦ no accounts, no tracking
          </p>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-card-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
