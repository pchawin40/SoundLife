import { describe, expect, it } from "vitest";
import { compareResults, decodeResultParams, encodeResultParams } from "@/lib/match";

describe("friend compatibility", () => {
  it("scores shared traits higher than mismatched traits", () => {
    const close = compareResults(
      { traits: [{ trait: "energy", percent: 91 }, { trait: "tempo", percent: 80 }] },
      { traits: [{ trait: "energy", percent: 87 }, { trait: "tempo", percent: 72 }] }
    );
    const far = compareResults(
      { traits: [{ trait: "energy", percent: 91 }, { trait: "tempo", percent: 80 }] },
      { traits: [{ trait: "softness", percent: 87 }, { trait: "romance", percent: 72 }] }
    );
    expect(close.matchPercent).toBeGreaterThan(far.matchPercent);
    expect(close.sharedTraits).toEqual(["energy", "tempo"]);
  });

  it("round-trips compact result params", () => {
    const encoded = encodeResultParams("s=gym&cards=boxing,heavy-bass&tone=roast");
    const decoded = decodeResultParams(encoded);
    expect(decoded?.params.get("s")).toBe("gym");
    expect(decoded?.params.get("tone")).toBe("roast");
  });
});
