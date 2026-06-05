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
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f1f7ff 50%, #ffeef7 100%)",
      }}
    >
      {/* Life Savers candy bags framing the play area, same art as the start screen. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Product.png"
        alt=""
        draggable={false}
        className="ls-decor opacity-90"
      />

      <div className="relative z-10 flex h-full flex-col">
        <Header score={score} timeLeft={timeLeft} />

        <main className="relative flex flex-1 flex-col items-center justify-center px-4">
          <div className="relative w-full max-w-[420px]">
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

          <p className="mt-5 text-center text-sm font-semibold text-(--ls-blue)/80">
            Swipe a candy to match 3 or more!
          </p>
        </main>
      </div>
    </div>
  )
}
