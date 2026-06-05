"use client"

import { useEffect, useRef, useState } from "react"

import { CLEAR_MS } from "@/lib/constants"
import {
  CANDY_IMAGE,
  type Board as BoardModel,
  type CandyType,
  type Position,
} from "@/lib/types"

/** A single rendered candy. Kept keyed by `id` so the DOM node persists across
 * board updates and CSS transitions animate its movement. */
interface Sprite {
  id: number
  type: CandyType
  row: number
  col: number
  entering: boolean
  clearing: boolean
}

interface Props {
  board: BoardModel
  size: number
  selected: Position | null
  invalidPair: readonly [Position, Position] | null
  onSelect: (pos: Position) => void
  onSwipe: (from: Position, to: Position) => void
}

const SWIPE_THRESHOLD = 14

/** Pure diff: maps a board to the sprite list, preserving ids so movement
 * animates, flagging fresh candies as entering and vanished ones as clearing. */
function diffSprites(prev: Sprite[], board: BoardModel): Sprite[] {
  const prevIds = new Set(prev.map((s) => s.id))
  const liveIds = new Set<number>()
  const next: Sprite[] = []

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const candy = board[row][col]
      if (!candy) continue
      liveIds.add(candy.id)
      next.push({
        id: candy.id,
        type: candy.type,
        row,
        col,
        entering: !prevIds.has(candy.id),
        clearing: false,
      })
    }
  }

  // Candies that vanished from the board pop out before being removed.
  for (const sprite of prev) {
    if (!liveIds.has(sprite.id) && !sprite.clearing) {
      next.push({ ...sprite, entering: false, clearing: true })
    }
  }

  return next
}

function matchesPosition(
  pos: Position | null,
  row: number,
  col: number
): boolean {
  return pos !== null && pos.row === row && pos.col === col
}

function inInvalidPair(
  pair: readonly [Position, Position] | null,
  row: number,
  col: number
): boolean {
  if (!pair) return false
  return (
    matchesPosition(pair[0], row, col) || matchesPosition(pair[1], row, col)
  )
}

export function GameBoard({
  board,
  size,
  selected,
  invalidPair,
  onSelect,
  onSwipe,
}: Props) {
  const [sprites, setSprites] = useState<Sprite[]>([])
  const [renderedBoard, setRenderedBoard] = useState<BoardModel | null>(null)
  const pointerStart = useRef<{ pos: Position; x: number; y: number } | null>(
    null
  )

  // Diff the incoming board against the rendered sprites: surviving candies
  // update their position (animated), new candies "enter" (drop in), and
  // removed candies linger briefly as "clearing" so they can pop out. This runs
  // during render (React's recommended "adjust state on prop change" pattern)
  // so it re-renders in one pass instead of an extra effect-driven commit.
  if (board !== renderedBoard) {
    setRenderedBoard(board)
    setSprites((prev) => diffSprites(prev, board))
  }

  // Remove popped-out candies once their clear animation has played.
  useEffect(() => {
    if (!sprites.some((s) => s.clearing)) return
    const id = setTimeout(() => {
      setSprites((prev) => prev.filter((s) => !s.clearing))
    }, CLEAR_MS)
    return () => clearTimeout(id)
  }, [sprites])

  const handlePointerUp = (event: React.PointerEvent) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    const { pos } = start

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      onSelect(pos) // tap
      return
    }

    const target: Position =
      Math.abs(dx) > Math.abs(dy)
        ? { row: pos.row, col: pos.col + (dx > 0 ? 1 : -1) }
        : { row: pos.row + (dy > 0 ? 1 : -1), col: pos.col }

    if (
      target.row < 0 ||
      target.row >= size ||
      target.col < 0 ||
      target.col >= size
    ) {
      onSelect(pos)
      return
    }

    onSwipe(pos, target)
  }

  return (
    <div className="ls-board">
      <div
        className="ls-board-grid"
        style={{ ["--bs" as string]: size }}
        onPointerUp={handlePointerUp}
      >
        {/* Static tile backdrop — one light-blue cell per board slot. */}
        {Array.from({ length: size * size }, (_, i) => {
          const row = Math.floor(i / size)
          const col = i % size
          return (
            <div
              key={`tile-${i}`}
              className="ls-tile"
              style={{ transform: `translate(${col * 100}%, ${row * 100}%)` }}
            />
          )
        })}

        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            className="ls-slot"
            data-selected={matchesPosition(selected, sprite.row, sprite.col)}
            data-invalid={inInvalidPair(invalidPair, sprite.row, sprite.col)}
            data-entering={sprite.entering}
            data-clearing={sprite.clearing}
            style={{
              transform: `translate(${sprite.col * 100}%, ${sprite.row * 100}%)`,
            }}
          >
            <button
              type="button"
              aria-label={`${sprite.type} candy at row ${sprite.row + 1}, column ${sprite.col + 1}`}
              className="ls-slot-btn"
              onPointerDown={(event) => {
                pointerStart.current = {
                  pos: { row: sprite.row, col: sprite.col },
                  x: event.clientX,
                  y: event.clientY,
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CANDY_IMAGE[sprite.type]}
                alt=""
                draggable={false}
                className="ls-candy-art"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
