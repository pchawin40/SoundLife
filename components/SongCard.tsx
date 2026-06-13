"use client";

import { useEffect, useSyncExternalStore } from "react";
import PlatformButtons from "./PlatformButtons";
import {
  getAudioSnapshot,
  subscribeAudio,
  togglePreview,
  pausePreview,
} from "@/lib/audio";
import type { Song } from "@/lib/types";

interface SongCardProps {
  song: Song;
  rank: number;
  resultIdentity?: string;
  note?: string;
}

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPreview({ previewUrl }: { previewUrl: string }) {
  const snap = useSyncExternalStore(
    subscribeAudio,
    () => getAudioSnapshot(previewUrl),
    () => ({ state: "idle" as const, currentTime: 0, duration: 0 })
  );

  useEffect(() => {
    return () => {
      pausePreview();
    };
  }, []);

  const handleToggle = async () => {
    await togglePreview(previewUrl);
  };

  const { state, currentTime, duration } = snap;
  const isActive = state === "playing" || state === "loading" || state === "paused";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-4 rounded-2xl border border-pink-100 bg-pink-50/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={state === "loading"}
          className="min-h-[38px] rounded-full bg-ink px-4 text-xs font-black text-paper transition-colors hover:bg-gray-800 active:scale-95 disabled:opacity-60"
        >
          {state === "loading"
            ? "Loading…"
            : state === "playing"
              ? "⏸ Pause"
              : "▶ Preview"}
        </button>
        <span className="rounded-full border border-pink-200 bg-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-pink-600">
          iTunes preview
        </span>
      </div>

      {isActive && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-pink-200">
            <div
              className="h-full rounded-full bg-pink-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-semibold text-pink-400">
            <span>{formatTime(currentTime)}</span>
            {duration > 0 && <span>{formatTime(duration)}</span>}
          </div>
        </div>
      )}

      {state === "failed" && (
        <p className="mt-2 text-[11px] font-semibold text-red-500">
          Preview unavailable — open on a streaming platform below.
        </p>
      )}

      {state !== "failed" && (
        <p className="mt-2 text-[10px] font-semibold leading-4 text-pink-500">
          Preview provided courtesy of iTunes. Stream only, never cached.
        </p>
      )}
    </div>
  );
}

export default function SongCard({ song, rank, resultIdentity, note }: SongCardProps) {
  const metaChips = [
    song.language !== "english" && song.language !== "instrumental"
      ? formatSlug(song.language)
      : null,
    song.genres[0] ? formatSlug(song.genres[0]) : null,
    song.era ?? null,
  ].filter((c): c is string => Boolean(c));

  const reason = note ?? `A strong fit for ${resultIdentity ?? "this result"}.`;

  return (
    <article className="rounded-[20px] border border-gray-100 bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-black tabular-nums text-gray-400">
          {String(rank).padStart(2, "0")}
        </span>
        {metaChips.length > 0 && (
          <span className="min-w-0 text-right text-[10px] font-black uppercase tracking-[0.13em] text-gray-400">
            {metaChips.join(" · ")}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {song.artworkUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={song.artworkUrl}
            alt=""
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0">
          <h4 className="text-xl font-black leading-tight tracking-tight text-ink">
            {song.title}
          </h4>
          <p className="mt-1 text-sm font-semibold text-gray-500">{song.artist}</p>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium leading-6 text-gray-500">{reason}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {song.chips.slice(0, 3).map((chip) => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600"
          >
            <span aria-hidden>{chip.emoji}</span>
            {chip.label}
          </span>
        ))}
      </div>

      {song.previewUrl && <AudioPreview previewUrl={song.previewUrl} />}

      <div className="mt-4">
        <PlatformButtons song={song} resultIdentity={resultIdentity} compact />
      </div>
    </article>
  );
}
