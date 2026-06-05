"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { track } from "@/lib/analytics"
import {
  areAdjacent,
  clearPositions,
  collapseAndRefill,
  createPlayableBoard,
  findRuns,
  hasMatches,
  hasValidMove,
  matchedPositions,
  scoreForRun,
  swap,
} from "@/lib/game/board"
import {
  CLEAR_MS,
  FALL_MS,
  FEEDBACK_MS,
  GAME_DURATION_S,
  LOADING_MS,
  SWAP_MS,
} from "@/lib/constants"
import type { Board, GameState, Position } from "@/lib/types"

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const samePosition = (a: Position, b: Position): boolean =>
  a.row === b.row && a.col === b.col

export interface UseGameResult {
  gameState: GameState
  board: Board
  score: number
  timeLeft: number
  selected: Position | null
  /** Pair of positions currently flagged as an invalid (rejected) swap. */
  invalidPair: readonly [Position, Position] | null
  showGreat: boolean
  isBusy: boolean
  startGame: () => void
  selectCell: (pos: Position) => void
  /** Direct adjacent swap, used by the swipe gesture (bypasses tap selection). */
  trySwap: (a: Position, b: Position) => void
  /** Reset back to the start screen (used by "try again" style restarts). */
  restart: () => void
}

export function useGame(): UseGameResult {
  const [gameState, setGameState] = useState<GameState>("loading")
  const [board, setBoard] = useState<Board>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S)
  const [selected, setSelected] = useState<Position | null>(null)
  const [invalidPair, setInvalidPair] = useState<
    readonly [Position, Position] | null
  >(null)
  const [showGreat, setShowGreat] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const mounted = useRef(true)
  const scoreRef = useRef(0)
  const completedRef = useRef(false)

  // Preview load → start screen, fired exactly once.
  useEffect(() => {
    mounted.current = true
    track("preview_loaded")
    const id = setTimeout(() => {
      if (mounted.current) setGameState("start")
    }, LOADING_MS)
    return () => {
      mounted.current = false
      clearTimeout(id)
    }
  }, [])

  // Countdown timer, active only while playing.
  useEffect(() => {
    if (gameState !== "playing") return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [gameState])

  // When the clock hits zero, complete the game once.
  useEffect(() => {
    if (gameState === "playing" && timeLeft === 0 && !completedRef.current) {
      completedRef.current = true
      track("game_completed")
      setGameState("completed")
    }
  }, [timeLeft, gameState])

  const addScore = useCallback((gained: number) => {
    const next = scoreRef.current + gained
    scoreRef.current = next
    setScore(next)
    track("score_updated", { score: next })
  }, [])

  /** Clear → score → collapse → refill, looping through chain reactions. */
  const resolveMatches = useCallback(
    async (startBoard: Board) => {
      let working = startBoard
      let chain = 0

      while (hasMatches(working)) {
        chain += 1
        const runs = findRuns(working)
        const gained = runs.reduce(
          (sum, run) => sum + scoreForRun(run.length),
          0
        )

        if (chain === 1) {
          setShowGreat(true)
          setTimeout(() => {
            if (mounted.current) setShowGreat(false)
          }, FEEDBACK_MS)
        }
        track("valid_match_completed")

        working = clearPositions(working, matchedPositions(runs))
        if (!mounted.current) return
        setBoard(working)
        addScore(gained)
        await delay(CLEAR_MS)

        working = collapseAndRefill(working)
        if (!mounted.current) return
        setBoard(working)
        await delay(FALL_MS)
      }

      // Keep the board solvable for the rest of the short session.
      if (!hasValidMove(working)) {
        working = createPlayableBoard(working.length)
        if (!mounted.current) return
        setBoard(working)
        await delay(FALL_MS)
      }
    },
    [addScore]
  )

  const attemptSwap = useCallback(
    async (a: Position, b: Position) => {
      setIsBusy(true)
      setSelected(null)
      track("candy_swapped")

      const original = board
      const swapped = swap(original, a, b)
      setBoard(swapped)
      await delay(SWAP_MS)

      if (hasMatches(swapped)) {
        await resolveMatches(swapped)
      } else {
        track("invalid_swap")
        setInvalidPair([a, b])
        await delay(SWAP_MS)
        if (!mounted.current) return
        setBoard(original)
        setInvalidPair(null)
        await delay(SWAP_MS)
      }

      if (mounted.current) setIsBusy(false)
    },
    [board, resolveMatches]
  )

  const selectCell = useCallback(
    (pos: Position) => {
      if (gameState !== "playing" || isBusy) return

      if (!selected) {
        setSelected(pos)
        return
      }
      if (samePosition(selected, pos)) {
        setSelected(null)
        return
      }
      if (areAdjacent(selected, pos)) {
        void attemptSwap(selected, pos)
        return
      }
      // Non-adjacent tap re-selects the new candy.
      setSelected(pos)
    },
    [gameState, isBusy, selected, attemptSwap]
  )

  const trySwap = useCallback(
    (a: Position, b: Position) => {
      if (gameState !== "playing" || isBusy) return
      if (!areAdjacent(a, b)) return
      setSelected(null)
      void attemptSwap(a, b)
    },
    [gameState, isBusy, attemptSwap]
  )

  const startGame = useCallback(() => {
    scoreRef.current = 0
    completedRef.current = false
    setScore(0)
    setTimeLeft(GAME_DURATION_S)
    setSelected(null)
    setInvalidPair(null)
    setShowGreat(false)
    setIsBusy(false)
    setBoard(createPlayableBoard())
    setGameState("playing")
    track("play_clicked")
  }, [])

  const restart = useCallback(() => {
    completedRef.current = false
    setGameState("start")
  }, [])

  return {
    gameState,
    board,
    score,
    timeLeft,
    selected,
    invalidPair,
    showGreat,
    isBusy,
    startGame,
    selectCell,
    trySwap,
    restart,
  }
}
