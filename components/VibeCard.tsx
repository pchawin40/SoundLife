"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { getCardVisual, resolveVibeTags, type CardVisual } from "@/lib/cardVisuals";
import type { CardType, VibeCardData } from "@/lib/types";

interface VibeCardProps {
  card: VibeCardData;
  /** 0 = top of the stack (draggable), 1+ = peeking behind. */
  stackPosition: number;
  onSwipe: (direction: 1 | -1 | 2) => void;
  partyMode?: boolean;
  isLocked?: boolean;
}

const SWIPE_OFFSET = 138;
const SWIPE_VELOCITY = 920;
const SUPER_OFFSET = 142;
const SUPER_VELOCITY = 920;

const STACK_TILT = [0, -1.5, 1.4, -0.8];
const STACK_X = [0, -14, 16, -4];
const STACK_Y = [0, 16, 32, 46];

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
    x: direction * 660,
    y: -18,
    rotate: direction * 5,
    opacity: 0,
    transition: { duration: 0.56, ease: "easeOut" as const },
  }),
};

function ThemeFallbackVisual({ visual }: { visual: CardVisual }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: visual.background }} />
      {visual.texture && (
        <div
          className="absolute inset-0 opacity-25 mix-blend-soft-light"
          style={{ backgroundImage: visual.texture }}
        />
      )}
      {visual.pattern && (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: visual.pattern,
            backgroundSize: "24px 24px",
          }}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_38%,rgba(0,0,0,0.16)_100%)]" />
      <div
        className="absolute inset-x-5 bottom-5 h-20 rounded-[22px] border border-white/20 bg-white/10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.20), rgba(255,255,255,0.04))",
        }}
      />
      <div
        className="absolute right-5 top-5 h-16 w-24 rounded-[18px] border border-white/20 bg-white/10"
        style={{ boxShadow: `inset 0 0 0 1px ${visual.accent}44` }}
      />
      <div
        className="absolute left-5 top-8 h-2 w-24 rounded-full opacity-70"
        style={{ backgroundColor: visual.accent }}
      />
    </div>
  );
}

function CardImagePanel({
  cardId,
  visual,
  typeLabel,
  typeLabelColor,
}: {
  cardId: string;
  visual: CardVisual;
  typeLabel: string | null;
  typeLabelColor: string;
}) {
  const candidates = useMemo(
    () =>
      [visual.imageUrl, visual.legacyImageUrl].filter((url): url is string => Boolean(url)),
    [visual.imageUrl, visual.legacyImageUrl]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [cardId, visual.imageUrl, visual.legacyImageUrl]);

  const activeUrl = candidates[activeIndex];

  return (
    <div className="relative h-[68%] overflow-hidden">
      {activeUrl ? (
        <>
          {/* Native img enables jpg -> legacy png -> gradient fallback chain */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUrl}
            alt={visual.imageAlt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              imageRendering: "auto",
              objectFit: "cover",
              objectPosition: visual.imagePosition ?? "center",
            }}
            onError={() => {
              if (process.env.NODE_ENV !== "production") {
                console.warn("[SoundLife card image missing]", cardId, activeUrl);
              }
              setActiveIndex((index) => index + 1);
            }}
          />
          <div className="absolute inset-0 opacity-45" style={{ backgroundImage: visual.overlay }} />
        </>
      ) : (
        <ThemeFallbackVisual visual={visual} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

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
  );
}

export default function VibeCard({
  card,
  stackPosition,
  onSwipe,
  partyMode = false,
  isLocked = false,
}: VibeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-360, 360], [-5.5, 5.5]);
  const likeOpacity = useTransform(x, [80, 210], [0, 1]);
  const nopeOpacity = useTransform(x, [-210, -80], [1, 0]);
  const superOpacity = useTransform(y, [-210, -90], [1, 0]);
  const stickerScale = useTransform(x, [-300, 0, 300], [1.03, 0.94, 1.03]);

  const isTop = stackPosition === 0;
  const visual = getCardVisual(card);
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
      drag={isTop && !isLocked ? true : false}
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 230, bounceDamping: 36 }}
      dragConstraints={{ left: -360, right: 360, top: -230, bottom: 130 }}
      whileDrag={isLocked ? undefined : { scale: 1.01 }}
      onDragEnd={(_, info) => {
        if (isLocked || !isTop) return;
        if (info.offset.y < -SUPER_OFFSET || info.velocity.y < -SUPER_VELOCITY) {
          onSwipe(2);
        } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
          onSwipe(1);
        } else if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
          onSwipe(-1);
        }
      }}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-surface shadow-card-lg ring-1 ring-black/[0.04]">
        <CardImagePanel
          cardId={card.id}
          visual={visual}
          typeLabel={typeLabel}
          typeLabelColor={typeLabelColor}
        />

        <div className="flex h-[32%] min-h-0 flex-col items-start justify-between gap-2.5 px-5 pb-9 pt-4 text-left sm:px-6 sm:pt-5">
          <div className="min-h-0 w-full">
            <h3 className="line-clamp-2 text-[24px] font-black leading-[1.02] tracking-tight text-gray-950 sm:text-[28px]">
              {card.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-gray-500">
              {card.subtitle}
            </p>
          </div>

          <div className="flex max-h-[58px] w-full flex-wrap gap-1.5 overflow-hidden">
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

        {isTop && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-6 text-[9px] font-black uppercase tracking-[0.18em] text-gray-300">
            <span>← Nope</span>
            <span>↑ Super</span>
            <span>Like →</span>
          </div>
        )}
      </div>

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
