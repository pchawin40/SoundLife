"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { VibeCardData } from "@/lib/types";

interface VibeCardProps {
  card: VibeCardData;
  /** 0 = top of the stack (draggable), 1+ = peeking behind. */
  stackPosition: number;
  onSwipe: (direction: 1 | -1) => void;
}

const SWIPE_OFFSET = 84;
const SWIPE_VELOCITY = 520;

/** Cards behind the top one fan out so the deck reads as physical. */
const STACK_TILT = [0, -5.5, 5, -3.5];
const STACK_X = [0, -34, 34, -12];
const STACK_Y = [0, 18, 36, 52];

const cardVariants = {
  enter: { scale: 0.9, y: 30, opacity: 0 },
  stack: (pos: number) => ({
    scale: 1 - pos * 0.045,
    x: STACK_X[pos] ?? 0,
    y: STACK_Y[pos] ?? pos * 18,
    rotate: STACK_TILT[pos] ?? 0,
    opacity: pos > 2 ? 0.42 : 1,
    transition: { duration: 0.34, ease: "easeOut" as const },
  }),
  exit: (direction: number) => ({
    x: direction * 640,
    y: -18,
    rotate: direction * 26,
    opacity: 0,
    transition: { duration: 0.34, ease: "easeIn" as const },
  }),
};

export default function VibeCard({ card, stackPosition, onSwipe }: VibeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-18, 18]);
  const vibeOpacity = useTransform(x, [36, 134], [0, 1]);
  const nopeOpacity = useTransform(x, [-134, -36], [1, 0]);
  const labelScale = useTransform(x, [-180, 0, 180], [1.08, 0.92, 1.08]);
  const isTop = stackPosition === 0;

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={
        isTop
          ? { x, rotate, zIndex: 20 - stackPosition }
          : { zIndex: 20 - stackPosition }
      }
      custom={stackPosition}
      variants={cardVariants}
      initial="enter"
      animate="stack"
      exit="exit"
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.72}
      dragConstraints={{ left: -280, right: 280 }}
      whileDrag={{ scale: 1.035 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
          onSwipe(1);
        } else if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
          onSwipe(-1);
        }
      }}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[30px] border border-white/10 bg-[#18130f] px-7 text-center shadow-card backdrop-blur-sm">
        <div
          className="absolute inset-0 bg-[linear-gradient(145deg,rgba(245,241,234,0.12),rgba(245,241,234,0.025)_46%,rgba(0,0,0,0.1))]"
          aria-hidden
        />
        <div className="absolute inset-x-8 top-0 h-px bg-white/25" aria-hidden />

        <span
          className="relative flex h-28 w-28 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.06] text-6xl shadow-card"
          aria-hidden
        >
          {card.emoji}
        </span>
        <div className="relative">
          <h3 className="text-2xl font-extrabold tracking-tight text-cream">
            {card.title}
          </h3>
          <p className="mt-2 text-base font-medium text-cream/60">{card.subtitle}</p>
        </div>
        {isTop && (
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.16em] text-cream/40">
            <span>← Pass</span>
            <span>Vibe →</span>
          </div>
        )}
      </div>

      {isTop && (
        <>
          <motion.span
            style={{ opacity: vibeOpacity, scale: labelScale }}
            className="absolute left-5 top-5 -rotate-12 rounded-2xl border-2 border-brand-tealSoft bg-[#0f0d0b]/80 px-4 py-2 text-lg font-black uppercase tracking-wider text-brand-tealSoft shadow-card"
          >
            Vibe →
          </motion.span>
          <motion.span
            style={{ opacity: nopeOpacity, scale: labelScale }}
            className="absolute right-5 top-5 rotate-12 rounded-2xl border-2 border-[#E2574C] bg-[#0f0d0b]/80 px-4 py-2 text-lg font-black uppercase tracking-wider text-[#E2574C] shadow-card"
          >
            ← Pass
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
