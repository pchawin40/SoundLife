"use client";

import { logOutboundClick } from "@/lib/analytics";
import { DEFAULT_CAMPAIGN, getPlatformLinks } from "@/lib/platforms";
import type { Song } from "@/lib/types";

interface PlatformButtonsProps {
  song: Song;
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
            className="flex min-h-[38px] min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-center text-[11px] font-black leading-tight transition-colors hover:brightness-95"
            style={{
              borderColor: `${p.color}44`,
              backgroundColor: `${p.color}0F`,
              color: p.color,
            }}
            aria-label={`Listen on ${p.name}`}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="min-w-0 text-gray-700">{p.name}</span>
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
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-colors hover:brightness-95"
          style={{
            borderColor: `${p.color}44`,
            backgroundColor: `${p.color}0F`,
            color: p.color,
          }}
          aria-label={`Listen on ${p.name}`}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-700">{p.name}</span>
        </a>
      ))}
    </div>
  );
}
