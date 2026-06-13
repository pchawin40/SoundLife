import PlatformButtons from "./PlatformButtons";
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

export default function SongCard({
  song,
  rank,
  resultIdentity,
  note,
}: SongCardProps) {
  const metaChips = [
    song.language !== "english" && song.language !== "instrumental"
      ? formatSlug(song.language)
      : null,
    song.genres[0] ? formatSlug(song.genres[0]) : null,
    song.era ?? null,
  ].filter((c): c is string => Boolean(c));

  const reason = note ?? `A strong fit for ${resultIdentity ?? "this result"}.`;

  return (
    <article className="rounded-[22px] border border-white/10 bg-[#17130f] p-4 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/20 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black tabular-nums text-cream/50">
          {String(rank).padStart(2, "0")}
        </span>
        {metaChips.length > 0 && (
          <span className="min-w-0 text-right text-[10px] font-black uppercase tracking-[0.13em] text-cream/40">
            {metaChips.join(" · ")}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-xl font-black leading-tight tracking-tight text-cream">
          {song.title}
        </h4>
        <p className="mt-1 text-sm font-semibold text-cream/60">{song.artist}</p>
      </div>

      <p className="mt-4 text-sm font-medium leading-6 text-cream/60">{reason}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {song.chips.slice(0, 3).map((chip) => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-cream/75"
          >
            <span aria-hidden>{chip.emoji}</span>
            {chip.label}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <PlatformButtons song={song} resultIdentity={resultIdentity} compact />
      </div>
    </article>
  );
}
