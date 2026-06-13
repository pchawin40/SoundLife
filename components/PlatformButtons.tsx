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
      <div className="flex flex-wrap gap-1.5">
        {links.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(p.id)}
            className="flex min-h-[32px] items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cream/70 transition-colors hover:border-white/25 hover:text-cream"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            {p.shortName}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {links.map((p) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(p.id)}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-cream transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
        </a>
      ))}
    </div>
  );
}
