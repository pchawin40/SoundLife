"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { resolveVibeTags, resolveVibeVisual, type VibeVisual } from "@/lib/vibeVisuals";
import type { CardType, VibeCardData } from "@/lib/types";

interface VibeCardProps {
  card: VibeCardData;
  /** 0 = top of the stack (draggable), 1+ = peeking behind. */
  stackPosition: number;
  onSwipe: (direction: 1 | -1 | 2) => void;
  partyMode?: boolean;
}

const SWIPE_OFFSET = 112;
const SWIPE_VELOCITY = 760;

const STACK_TILT = [0, -2.4, 2.2, -1.2];
const STACK_X = [0, -18, 20, -6];
const STACK_Y = [0, 18, 36, 50];

const TYPE_LABELS: Record<CardType, string> = {
  lifestyle: "Lifestyle",
  mood: "Mood",
  sound: "Sound",
  genre: "Genre",
  antiGenre: "Avoid",
  language: "Language",
  region: "Region",
};

const TYPE_LABEL_COLORS: Record<CardType, string> = {
  lifestyle: "#92400e",
  mood: "#5b21b6",
  sound: "#1e40af",
  genre: "#065f46",
  antiGenre: "#991b1b",
  language: "#0c4a6e",
  region: "#831843",
};

const cardVariants = {
  enter: { scale: 0.9, y: 34, opacity: 0 },
  exit: (direction: 1 | -1 = 1) => ({
    x: direction * 620,
    y: -22,
    rotate: direction * 8,
    opacity: 0,
    transition: { duration: 0.44, ease: "easeOut" as const },
  }),
};

function EditorialFallbackVisual({ visual }: { visual: VibeVisual }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-90" style={{ background: visual.background }} />
      <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute right-7 top-12 h-52 w-32 rotate-6 rounded-[34px] bg-white/20 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-sm" />
      <div className="absolute bottom-8 left-8 h-44 w-28 -rotate-6 rounded-t-full bg-black/25 shadow-[0_24px_60px_rgba(15,23,42,0.24)]" />
      <div
        className="absolute bottom-16 right-9 h-24 w-24 rounded-full border border-white/35 bg-white/20 backdrop-blur-sm"
        style={{ boxShadow: `0 0 80px ${visual.accent}66` }}
      />
      <div className="absolute inset-x-8 bottom-9 h-px bg-white/40" />
    </div>
  );
}

export default function VibeCard({
  card,
  stackPosition,
  onSwipe,
  partyMode = false,
}: VibeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-360, 360], [-7.5, 7.5]);
  const likeOpacity = useTransform(x, [60, 180], [0, 1]);
  const nopeOpacity = useTransform(x, [-180, -60], [1, 0]);
  const superOpacity = useTransform(y, [-180, -72], [1, 0]);
  const stickerScale = useTransform(x, [-280, 0, 280], [1.04, 0.92, 1.04]);

  const isTop = stackPosition === 0;
  const visual = resolveVibeVisual(card);
  const tags = resolveVibeTags(card, visual);
  const typeLabel = card.cardType ? TYPE_LABELS[card.cardType] : null;
  const typeLabelColor = card.cardType ? TYPE_LABEL_COLORS[card.cardType] : "#374151";
  const stackAnimation = {
    scale: 1 - stackPosition * 0.035,
    x: STACK_X[stackPosition] ?? 0,
    y: STACK_Y[stackPosition] ?? stackPosition * 16,
    rotate: STACK_TILT[stackPosition] ?? 0,
    opacity: stackPosition > 2 ? 0 : 1,
    transition: { type: "spring" as const, stiffness: 210, damping: 28, mass: 0.95 },
  };
  const visualStyle = visual.imageUrl
    ? {
        backgroundImage: `${visual.overlay}, url(${visual.imageUrl})`,
        backgroundPosition: visual.imagePosition ?? "center",
        backgroundSize: "cover",
      }
    : { background: visual.background };

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={
        isTop
          ? { x, y, rotate, zIndex: 20 - stackPosition }
          : { zIndex: 20 - stackPosition }
      }
      variants={cardVariants}
      initial="enter"
      animate={stackAnimation}
      exit="exit"
      drag={isTop ? true : false}
      dragSnapToOrigin
      dragElastic={0.26}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 34 }}
      dragConstraints={{ left: -360, right: 360, top: -220, bottom: 140 }}
      whileDrag={{ scale: 1.015 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -112 || info.velocity.y < -760) {
          onSwipe(2);
        } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
          onSwipe(1);
        } else if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
          onSwipe(-1);
        }
      }}
    >
      {/* Card body */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-white shadow-card-lg ring-1 ring-black/[0.04]">
        {/* Editorial image area */}
        <div className="relative h-[68%] overflow-hidden" style={visualStyle}>
          {!visual.imageUrl && <EditorialFallbackVisual visual={visual} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-white/5" />

          {/* Card type label */}
          {typeLabel && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255,255,255,0.82)",
                color: typeLabelColor,
                border: `1px solid ${typeLabelColor}24`,
              }}
            >
              {typeLabel}
            </span>
          )}
          <span className="absolute right-4 top-4 rounded-full border border-white/35 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-md">
            {visual.eyebrow}
          </span>
        </div>

        {/* Bottom content */}
        <div className="flex h-[32%] flex-col items-start justify-between gap-3 px-6 pb-9 pt-5 text-left">
          <div>
            <h3 className="text-[26px] font-black leading-[1.02] tracking-tight text-gray-950 sm:text-[28px]">
              {card.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-gray-500">
              {card.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]"
                style={{
                  backgroundColor: `${visual.accent}12`,
                  borderColor: `${visual.accent}2E`,
                  color: visual.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hint bar */}
        {isTop && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-6 text-[9px] font-black uppercase tracking-[0.18em] text-gray-300">
            <span>← Nope</span>
            <span>↑ Super</span>
            <span>Like →</span>
          </div>
        )}
      </div>

      {/* Sticker overlays — only on top card */}
      {isTop && (
        <>
          <motion.span
            style={{ opacity: likeOpacity, scale: stickerScale }}
            className="pointer-events-none absolute left-5 top-7 -rotate-12 rounded-xl border-[3px] border-green-500 bg-white/95 px-4 py-2 text-lg font-black uppercase tracking-wider text-green-500 shadow-card backdrop-blur-sm"
          >
            {partyMode ? "LIKE IT" : "LIKE"}
          </motion.span>
          <motion.span
            style={{ opacity: nopeOpacity, scale: stickerScale }}
            className="pointer-events-none absolute right-5 top-7 rotate-12 rounded-xl border-[3px] border-red-500 bg-white/95 px-4 py-2 text-lg font-black uppercase tracking-wider text-red-500 shadow-card backdrop-blur-sm"
          >
            {partyMode ? "PASS" : "NOPE"}
          </motion.span>
          <motion.span
            style={{ opacity: superOpacity }}
            className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 -rotate-3 rounded-xl border-[3px] border-yellow-400 bg-white/95 px-4 py-2 text-lg font-black uppercase tracking-wider text-yellow-500 shadow-card backdrop-blur-sm"
          >
            SUPER VIBE
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
