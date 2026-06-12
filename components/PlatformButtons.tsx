import { PLATFORMS } from "@/lib/share";

interface PlatformButtonsProps {
  query: string;
  compact?: boolean;
}

export default function PlatformButtons({ query, compact = false }: PlatformButtonsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {PLATFORMS.map((p) => (
          <a
            key={p.id}
            href={p.url(query)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[32px] items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cream/70 transition-colors hover:border-white/25 hover:text-cream"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            {p.name.replace(" Music", "")}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {PLATFORMS.map((p) => (
        <a
          key={p.id}
          href={p.url(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-cream transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
        </a>
      ))}
    </div>
  );
}
