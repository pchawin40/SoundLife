"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStorageValue, setStorageValue } from "@/lib/storage";

const FEATURES: Array<{ icon: string; text: string }> = [
  { icon: "🎭", text: "Unlock every identity + secret archetypes" },
  { icon: "♾️", text: "Unlimited redos and deeper 15-card decks" },
  { icon: "🎨", text: "Premium story-card styles & exclusive themes" },
  { icon: "📈", text: "Watch your taste evolve over time" },
];

export default function PlusTease() {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setJoined(getStorageValue("plusInterest") === "1");
  }, []);

  const join = () => {
    setStorageValue("plusInterest", "1");
    setJoined(true);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-brand-violet/25 bg-surface p-5 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(124,58,237,0.10), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-violet/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-brand-violet">
          ✦ SoundLife Plus
        </span>
        <h3 className="mt-3 text-xl font-black leading-tight text-ink">
          Go deeper than the daily swipe.
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li
              key={f.text}
              className="flex items-start gap-2 text-sm font-semibold leading-5 text-gray-600"
            >
              <span aria-hidden>{f.icon}</span>
              {f.text}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={join}
          disabled={joined}
          className="mt-5 flex min-h-[46px] w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-black text-paper transition-colors hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70"
        >
          {joined ? "You're on the list ✓" : "Join the Plus waitlist"}
        </button>
        <motion.p
          key={joined ? "joined" : "open"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center text-xs font-medium text-gray-400"
        >
          {joined
            ? "We'll ping you when Plus drops. Free stays free, always."
            : "No charge today — just claim your spot. Free stays free."}
        </motion.p>
      </div>
    </section>
  );
}
