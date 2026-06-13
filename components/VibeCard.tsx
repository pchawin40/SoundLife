"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { VibeCardData } from "@/lib/types";

interface VibeCardProps {
  card: VibeCardData;
  /** 0 = top of the stack (draggable), 1-2 = peeking behind. */
  stackPosition: number;
  onSwipe: (direction: 1 | -1) => void;
}

const SWIPE_OFFSET = 90;
const SWIPE_VELOCITY = 600;

/** Cards behind the top one fan out with a slight alternating tilt. */
const STACK_TILT = [0, 2.2, -2];

const cardVariants = {
  enter: { scale: 0.9, y: 30, opacity: 0 },
  stack: (pos: number) => ({
    scale: 1 - pos * 0.05,
    y: pos * 14,
    opacity: pos > 1.5 ? 0.4 : 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  }),
  exit: (direction: number) => ({
    x: direction * 520,
    rotate: direction * 24,
    opacity: 0,
    transition: { duration: 0.32, ease: "easeIn" as const },
  }),
};

export default function VibeCard({ card, stackPosition, onSwipe }: VibeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const vibeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);
  const isTop = stackPosition === 0;

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={{ x, rotate, zIndex: 10 - stackPosition }}
      custom={stackPosition}
      variants={cardVariants}
      initial="enter"
      animate="stack"
      exit="exit"
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      whileDrag={{ scale: 1.03 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
          onSwipe(1);
        } else if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
          onSwipe(-1);
        }
      }}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] px-8 text-center shadow-card backdrop-blur-sm transition-transform duration-300"
        style={{ transform: `rotate(${STACK_TILT[stackPosition] ?? 0}deg)` }}
      >
        <span
          className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-6xl"
          aria-hidden
        >
          {card.emoji}
        </span>
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-cream">
            {card.title}
          </h3>
          <p className="mt-2 text-base text-cream/60">{card.subtitle}</p>
        </div>
        {isTop && (
          <p className="absolute bottom-5 text-xs font-medium uppercase tracking-widest text-cream/30">
            ← not me · vibe →
          </p>
        )}
      </div>

      {isTop && (
        <>
          <motion.span
            style={{ opacity: vibeOpacity }}
            className="absolute left-5 top-5 -rotate-12 rounded-xl border-2 border-brand-tealSoft px-3 py-1 text-lg font-black uppercase tracking-wider text-brand-tealSoft"
          >
            Vibe
          </motion.span>
          <motion.span
            style={{ opacity: nopeOpacity }}
            className="absolute right-5 top-5 rotate-12 rounded-xl border-2 border-[#E2574C] px-3 py-1 text-lg font-black uppercase tracking-wider text-[#E2574C]"
          >
            Not me
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
