"use client"

import { EndScreen } from "@/components/game/end-screen"
import { GameScreen } from "@/components/game/game-screen"
import { StartScreen } from "@/components/game/start-screen"
import { useGame } from "@/hooks/useGame"
import LoadingSplash from "../ui/loading-splash"

export function PlayableRoot() {
  const {
    gameState,
    board,
    score,
    timeLeft,
    selected,
    invalidPair,
    showGreat,
    startGame,
    selectCell,
    trySwap,
    restart,
  } = useGame()

  return (
    <div className="ls-shell">
      <div className="ls-stage">
        {gameState === "loading" && <LoadingSplash />}
        {gameState === "start" && <StartScreen onPlay={startGame} />}
        {gameState === "playing" && (
          <GameScreen
            board={board}
            score={score}
            timeLeft={timeLeft}
            selected={selected}
            invalidPair={invalidPair}
            showGreat={showGreat}
            onSelect={selectCell}
            onSwipe={trySwap}
          />
        )}
        {gameState === "completed" && (
          <EndScreen score={score} onReplay={restart} />
        )}
      </div>
    </div>
  )
}
