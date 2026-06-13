import { describe, expect, it } from "vitest";
import { getDailyPrompt, toUtcDateKey } from "@/lib/daily";

describe("daily prompt", () => {
  it("uses the UTC date key", () => {
    expect(toUtcDateKey(new Date("2026-06-12T23:59:59-07:00"))).toBe("2026-06-13");
  });

  it("is deterministic for the same UTC day", () => {
    const a = getDailyPrompt(new Date("2026-06-12T05:00:00Z"));
    const b = getDailyPrompt("2026-06-12");
    expect(a).toEqual(b);
    expect(a.seed).toBeGreaterThan(0);
  });

  it("changes signal across different days", () => {
    expect(getDailyPrompt("2026-06-12").seed).not.toBe(getDailyPrompt("2026-06-13").seed);
  });
});
