"use client"

import { GameBoard } from "@/components/game/game-board"
import { FEEDBACK_MS } from "@/lib/constants"
import type { Board as BoardModel, Position } from "@/lib/types"
import { Header } from "./header"

interface GameScreenProps {
  board: BoardModel
  score: number
  timeLeft: number
  selected: Position | null
  invalidPair: readonly [Position, Position] | null
  showGreat: boolean
  onSelect: (pos: Position) => void
  onSwipe: (from: Position, to: Position) => void
}

export function GameScreen({
  board,
  score,
  timeLeft,
  selected,
  invalidPair,
  showGreat,
  onSelect,
  onSwipe,
}: GameScreenProps) {
  const size = board.length || 6

  return (
    <div className="ls-gamescreen">
      {/* Full-frame Life Savers art: rainbow garland, hanging banner and the
          candy decorations that surround the play area. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/frame-trimmed.png"
        alt="Life Savers"
        draggable={false}
        className="ls-gs-frame"
      />

      {/* Blue score / countdown bar, anchored just below the banner. */}
      <div className="ls-gs-score">
        <Header score={score} timeLeft={timeLeft} />
      </div>

      {/* Rainbow-framed board, centred in the open middle of the frame. */}
      <div className="ls-gs-board">
        <GameBoard
          board={board}
          size={size}
          selected={selected}
          invalidPair={invalidPair}
          onSelect={onSelect}
          onSwipe={onSwipe}
        />

        {showGreat && (
          <div
            className="ls-great"
            style={{ ["--great-ms" as string]: `${FEEDBACK_MS}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/great.png" alt="Great!" />
          </div>
        )}
      </div>
    </div>
  )
}
