"use client"

import { GAME_DURATION_S } from "@/lib/constants"

interface HeaderProps {
  score: number
  timeLeft: number
}

export function Header({ score, timeLeft }: HeaderProps) {
  const urgent = timeLeft <= 5
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")
  const progress = Math.max(0, Math.min(1, timeLeft / GAME_DURATION_S))

  return (
    <header className="ls-header-light">
      {/* Rainbow candy scallop garland along the very top edge. */}
      <div className="ls-garland" />

      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/VectorSmartObject_1.png"
            alt="Life Savers"
            className="h-8 w-auto drop-shadow-sm"
          />
        </div>

        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="ls-stat flex flex-1 items-center justify-between gap-2 py-1 pr-1 pl-3">
            <span className="text-[11px] font-extrabold tracking-[0.18em] text-(--ls-blue)">
              SCORE
            </span>
            <span className="ls-stat-chip min-w-14 px-3 py-1 text-center text-base leading-none font-extrabold text-white tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="ls-stat flex w-[42%] items-center justify-between gap-2 py-1 pr-1 pl-3">
            <span className="text-[11px] font-extrabold tracking-[0.18em] text-(--ls-blue)">
              TIME
            </span>
            <span
              className={`ls-stat-chip min-w-14 px-3 py-1 text-center text-base leading-none font-extrabold text-white tabular-nums ${
                urgent ? "animate-pulse" : ""
              }`}
            >
              {mm}:{ss}
            </span>
          </div>
        </div>

        {/* Slim countdown bar under the pills. */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--ls-tile)">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{
              width: `${progress * 100}%`,
              background: urgent
                ? "var(--ls-red)"
                : "linear-gradient(90deg, var(--ls-green), var(--ls-yellow))",
            }}
          />
        </div>
      </div>
    </header>
  )
}
