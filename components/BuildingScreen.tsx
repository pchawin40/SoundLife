"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Reading your swipes…",
  "Judging you. Gently.",
  "Cross-checking the group chat…",
  "Cutting tracks that almost made it…",
  "Naming your era…",
  "This is getting suspiciously accurate…",
];

const BAR_COLORS = ["#0D9488", "#7C3AED", "#D97706", "#DB2777", "#14B8A6"];

export default function BuildingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setMessageIndex((i) => (i + 1) % MESSAGES.length),
      520
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-8">
      <div className="flex h-16 items-end gap-1.5">
        {BAR_COLORS.map((color, i) => (
          <motion.span
            key={color}
            className="w-2.5 rounded-full"
            style={{ backgroundColor: color, originY: 1 }}
            animate={{ height: [12, 56, 12] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          />
        ))}
      </div>
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-base font-semibold text-gray-500"
      >
        {MESSAGES[messageIndex]}
      </motion.p>
    </div>
  );
}
