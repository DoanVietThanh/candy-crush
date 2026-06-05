/** Analytics for the playable. Events are recorded in-memory, dispatched as a
 * DOM CustomEvent (so the host page / QA can observe them), and forwarded to an
 * optional ad-network hook `window.__playableTrack` when present. No raw
 * console logging in production paths. */

export type AnalyticsEvent =
  | "preview_loaded"
  | "play_clicked"
  | "candy_swapped"
  | "valid_match_completed"
  | "invalid_swap"
  | "score_updated"
  | "game_completed"
  | "cta_clicked"

export type AnalyticsParams = Record<string, string | number | boolean>

export interface TrackedEvent {
  event: AnalyticsEvent
  params?: AnalyticsParams
  at: number
}

type PlayableTrackHook = (
  event: AnalyticsEvent,
  params?: AnalyticsParams
) => void

declare global {
  interface Window {
    __playableTrack?: PlayableTrackHook
    __playableEvents?: TrackedEvent[]
  }
}

export const ANALYTICS_EVENT_NAME = "playable:track"

/** Fire an analytics event. Safe to call during SSR (no-ops without `window`). */
export function track(event: AnalyticsEvent, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return

  const entry: TrackedEvent = { event, params, at: performance.now() }

  window.__playableEvents = window.__playableEvents ?? []
  window.__playableEvents.push(entry)

  try {
    window.__playableTrack?.(event, params)
  } catch {
    // Never let a host-supplied hook break gameplay.
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_NAME, { detail: entry }))
}
