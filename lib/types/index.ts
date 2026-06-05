/** Core domain types for the Life Savers match-3 playable. */

/** The five playable candy variants, each backed by a brand asset. */
export type CandyType = "red" | "orange" | "yellow" | "green" | "blue"

/** A single candy on the board. `id` is stable across renders so the UI can
 * animate movement (fall/swap) instead of swapping DOM nodes. */
export interface Candy {
  id: number
  type: CandyType
}

/** A board cell. `null` represents an empty slot mid-resolution. */
export type Cell = Candy | null

/** The board, indexed `board[row][col]`, row 0 at the top. */
export type Board = Cell[][]

export interface Position {
  row: number
  col: number
}

/** Finite game lifecycle, mirroring the playable's flow. */
export type GameState = "loading" | "start" | "playing" | "completed"

export const CANDY_TYPES: readonly CandyType[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
] as const

/** Maps each candy type to its served image. */
export const CANDY_IMAGE: Record<CandyType, string> = {
  red: "/images/Red.png",
  orange: "/images/Orange.png",
  yellow: "/images/Yellow.png",
  green: "/images/Green.png",
  blue: "/images/Blue.png",
}
