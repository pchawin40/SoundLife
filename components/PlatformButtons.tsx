"use client";

import { logOutboundClick } from "@/lib/analytics";
import { DEFAULT_CAMPAIGN, getPlatformLinks } from "@/lib/platforms";
import type { Song } from "@/lib/types";

interface PlatformButtonsProps {
  song: Song;
  /** Passed through to click analytics, e.g. the result identity. */
  resultIdentity?: string;
  compact?: boolean;
}

export default function PlatformButtons({
  song,
  resultIdentity,
  compact = false,
}: PlatformButtonsProps) {
  const links = getPlatformLinks(song);

  const handleClick = (platform: string) => {
    // Fire-and-forget; the anchor navigates regardless.
    logOutboundClick({
      songId: song.id,
      platform,
      campaign: DEFAULT_CAMPAIGN,
      resultIdentity,
    });
  };

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {links.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(p.id)}
            className="flex min-h-[40px] min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-center text-[11px] font-black leading-tight text-cream transition-colors hover:bg-white/10"
            style={{
              borderColor: `${p.color}55`,
              backgroundColor: `${p.color}12`,
            }}
            aria-label={`Listen on ${p.name}`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="min-w-0">{p.name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {links.map((p) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(p.id)}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black text-cream transition-colors hover:bg-white/10"
          style={{
            borderColor: `${p.color}55`,
            backgroundColor: `${p.color}12`,
          }}
          aria-label={`Listen on ${p.name}`}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
        </a>
      ))}
    </div>
  );
}
