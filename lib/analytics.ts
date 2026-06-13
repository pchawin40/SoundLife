import { getSupabase } from "./supabaseClient";
import type { ResultData } from "./types";

/**
 * Fire-and-forget analytics. Every function returns void immediately,
 * swallows all errors, and never blocks navigation. With Supabase
 * unconfigured these are no-ops.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function logResultEvent(input: {
  result: ResultData;
  likedCardIds: string[];
  region?: string | null;
}): void {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    const { result, likedCardIds, region } = input;
    void supabase
      .from("result_events")
      .insert({
        scenario_id: result.scenarioId,
        liked_card_ids: likedCardIds,
        identity: result.identity,
        top_traits: result.traits.slice(0, 3),
        top_song_ids: result.songs.slice(0, 10).map((s) => s.id),
        language_filter: result.filterId === "global" ? null : result.filterId,
        region_filter: region ?? null,
      })
      .then(noop, noop);
  } catch {
    // never surface analytics failures
  }
}

export function logOutboundClick(input: {
  songId?: string | null;
  platform: string;
  campaign: string;
  resultIdentity?: string | null;
}): void {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    void supabase
      .from("outbound_click_events")
      .insert({
        // Column is uuid — local fallback songs use slugs, so only send real uuids.
        song_id: input.songId && UUID_RE.test(input.songId) ? input.songId : null,
        platform: input.platform,
        campaign: input.campaign,
        result_identity: input.resultIdentity ?? null,
      })
      .then(noop, noop);
  } catch {
    // never surface analytics failures
  }
}

function noop(): void {}
