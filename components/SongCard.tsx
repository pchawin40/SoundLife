import PlatformButtons from "./PlatformButtons";
import type { Song } from "@/lib/types";

interface SongCardProps {
  song: Song;
  rank: number;
}

export default function SongCard({ song, rank }: SongCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 w-6 shrink-0 text-right text-sm font-bold tabular-nums text-cream/40">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold leading-tight text-cream">
            {song.title}
          </p>
          <p className="truncate text-sm text-cream/60">{song.artist}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {song.chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-cream/75"
              >
                <span aria-hidden>{chip.emoji}</span>
                {chip.label}
              </span>
            ))}
          </div>
          <div className="mt-2.5">
            <PlatformButtons query={`${song.title} ${song.artist}`} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
