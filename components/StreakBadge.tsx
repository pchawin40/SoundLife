"use client";

import type { SoundLifeProfileState } from "@/lib/types";

interface StreakBadgeProps {
  profile: SoundLifeProfileState;
  compact?: boolean;
}

export default function StreakBadge({ profile, compact = false }: StreakBadgeProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700">
        <span aria-hidden>🔥</span>
        {profile.currentStreak} day{profile.currentStreak === 1 ? "" : "s"}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-orange-100 bg-surface p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-500">
        Sound streak
      </p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black leading-none text-ink">
            <span aria-hidden>🔥 </span>
            {profile.currentStreak}
          </p>
          <p className="mt-1 text-xs font-bold text-gray-400">
            max {profile.maxStreak} · {profile.totalIdentities} discovered
          </p>
        </div>
        <p className="max-w-[150px] text-right text-xs font-semibold leading-5 text-gray-500">
          One missed day pauses the streak. Two missed days starts a new era.
        </p>
      </div>
    </section>
  );
}
