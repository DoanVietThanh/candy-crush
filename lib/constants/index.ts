/** Shared gameplay + animation timings. Imported by both the game hook and the
 * rendering components so JS sequencing and CSS transition durations stay in
 * lockstep (never hardcode these twice). Durations follow CLAUDE.md spec. */

export const GAME_DURATION_S = 20

export const SWAP_MS = 220
export const CLEAR_MS = 200
export const FALL_MS = 280
export const FEEDBACK_MS = 650

/** Short loading splash before the start screen. */
export const LOADING_MS = 600
