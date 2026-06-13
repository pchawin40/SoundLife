import { describe, expect, it } from "vitest";
import {
  EMPTY_PROFILE_STATE,
  deriveIdentityRarity,
  updateSoundLifeProfile,
} from "@/lib/streak";
import type { SoundLifeCollectionItem } from "@/lib/types";

const item: SoundLifeCollectionItem = {
  id: "2026-06-12:gym-villain-arc:aggression-confidence-energy",
  identity: "Gym Villain Arc",
  archetypeId: "gym-villain-arc",
  scenarioId: "gym",
  discoveredAt: "2026-06-12",
  topTraits: ["aggression", "confidence", "energy"],
  matchPercent: 94,
  rarity: "rare",
  sharePath: "/result?s=gym",
};

describe("streak math", () => {
  it("starts a fresh profile at streak 1 when a result is discovered", () => {
    const next = updateSoundLifeProfile(EMPTY_PROFILE_STATE, "2026-06-12", item);
    expect(next.currentStreak).toBe(1);
    expect(next.maxStreak).toBe(1);
    expect(next.totalIdentities).toBe(1);
  });

  it("increments on consecutive days", () => {
    const dayOne = updateSoundLifeProfile(EMPTY_PROFILE_STATE, "2026-06-12", item);
    const dayTwo = updateSoundLifeProfile(dayOne, "2026-06-13", {
      ...item,
      id: "2026-06-13:tokyo-night-drive:cinematic-darkness-tempo",
      discoveredAt: "2026-06-13",
      identity: "Tokyo Night Drive",
    });
    expect(dayTwo.currentStreak).toBe(2);
    expect(dayTwo.maxStreak).toBe(2);
  });

  it("uses one missed day as a pause instead of a reset", () => {
    const dayOne = updateSoundLifeProfile(EMPTY_PROFILE_STATE, "2026-06-12", item);
    const afterGrace = updateSoundLifeProfile(dayOne, "2026-06-14", {
      ...item,
      id: "2026-06-14:quiet-storm:focus-darkness-softness",
      discoveredAt: "2026-06-14",
      identity: "Quiet Storm",
    });
    expect(afterGrace.currentStreak).toBe(1);
    expect(afterGrace.maxStreak).toBe(1);
  });

  it("resets after more than one missed day", () => {
    const state = updateSoundLifeProfile(
      { ...EMPTY_PROFILE_STATE, currentStreak: 4, maxStreak: 4, lastPlayedDate: "2026-06-10" },
      "2026-06-13",
      item
    );
    expect(state.currentStreak).toBe(1);
    expect(state.maxStreak).toBe(4);
  });

  it("derives rarity deterministically", () => {
    expect(deriveIdentityRarity(["aggression", "confidence", "energy"], 94)).toBe(
      deriveIdentityRarity(["energy", "aggression", "confidence"], 94)
    );
  });
});
