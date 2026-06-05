import {
  type Board,
  type Candy,
  type CandyType,
  type Cell,
  type Position,
  CANDY_TYPES,
} from "../types"

/** Default board dimensions. A 6×6 grid with 5 candy types keeps match
 * density high enough that a player lands a valid move within seconds. */
export const BOARD_SIZE = 6
export const MIN_MATCH = 3

/** Scores by run length: 3→100, 4→200, 5+→300. */
export function scoreForRun(length: number): number {
  if (length >= 5) return 300
  if (length === 4) return 200
  return 100
}

let nextId = 0
function createCandy(type: CandyType): Candy {
  nextId += 1
  return { id: nextId, type }
}

function randomType(exclude: ReadonlySet<CandyType> = new Set()): CandyType {
  const pool = CANDY_TYPES.filter((t) => !exclude.has(t))
  const choices = pool.length > 0 ? pool : CANDY_TYPES
  return choices[Math.floor(Math.random() * choices.length)]
}

/** Picks a candy type for `(row, col)` that does not immediately complete a
 * horizontal or vertical run with already-placed neighbours above/left. */
function nonMatchingType(board: Board, row: number, col: number): CandyType {
  const excluded = new Set<CandyType>()

  const left1 = board[row]?.[col - 1]
  const left2 = board[row]?.[col - 2]
  if (left1 && left2 && left1.type === left2.type) excluded.add(left1.type)

  const up1 = board[row - 1]?.[col]
  const up2 = board[row - 2]?.[col]
  if (up1 && up2 && up1.type === up2.type) excluded.add(up1.type)

  return randomType(excluded)
}

/** Builds a fully populated board guaranteed to contain no pre-existing matches. */
export function createBoard(size: number = BOARD_SIZE): Board {
  const board: Board = Array.from({ length: size }, () =>
    Array.from<Cell>({ length: size }).fill(null)
  )

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      board[row][col] = createCandy(nonMatchingType(board, row, col))
    }
  }

  return board
}

export function areAdjacent(a: Position, b: Position): boolean {
  const rowDiff = Math.abs(a.row - b.row)
  const colDiff = Math.abs(a.col - b.col)
  return rowDiff + colDiff === 1
}

/** Returns a new board with the candies at `a` and `b` exchanged. */
export function swap(board: Board, a: Position, b: Position): Board {
  const next = board.map((r) => r.slice())
  const temp = next[a.row][a.col]
  next[a.row][a.col] = next[b.row][b.col]
  next[b.row][b.col] = temp
  return next
}

/** Finds every horizontal and vertical run of ≥3 same-type candies.
 * Returns one entry per run so callers can score by run length. */
export function findRuns(board: Board): Position[][] {
  const runs: Position[][] = []
  const size = board.length

  const collect = (line: Position[]): void => {
    let start = 0
    while (start < line.length) {
      const cell = board[line[start].row][line[start].col]
      let end = start + 1
      while (
        end < line.length &&
        cell !== null &&
        board[line[end].row][line[end].col]?.type === cell.type
      ) {
        end += 1
      }
      if (cell !== null && end - start >= MIN_MATCH) {
        runs.push(line.slice(start, end))
      }
      start = end
    }
  }

  for (let row = 0; row < size; row += 1) {
    collect(Array.from({ length: size }, (_, col) => ({ row, col })))
  }
  for (let col = 0; col < size; col += 1) {
    collect(Array.from({ length: size }, (_, row) => ({ row, col })))
  }

  return runs
}

export function hasMatches(board: Board): boolean {
  return findRuns(board).length > 0
}

/** Flattens runs into a de-duplicated set of positions to clear. */
export function matchedPositions(runs: Position[][]): Position[] {
  const seen = new Set<string>()
  const positions: Position[] = []
  for (const run of runs) {
    for (const pos of run) {
      const key = `${pos.row}:${pos.col}`
      if (!seen.has(key)) {
        seen.add(key)
        positions.push(pos)
      }
    }
  }
  return positions
}

/** Returns a new board with the given positions emptied (set to `null`). */
export function clearPositions(board: Board, positions: Position[]): Board {
  const next = board.map((r) => r.slice())
  for (const { row, col } of positions) {
    next[row][col] = null
  }
  return next
}

/** Drops candies into empty cells and refills the top with fresh candies.
 * Existing candies keep their `id` so the UI animates them falling. */
export function collapseAndRefill(board: Board): Board {
  const size = board.length
  const next: Board = Array.from({ length: size }, () =>
    Array.from<Cell>({ length: size }).fill(null)
  )

  for (let col = 0; col < size; col += 1) {
    const survivors: Candy[] = []
    for (let row = size - 1; row >= 0; row -= 1) {
      const cell = board[row][col]
      if (cell !== null) survivors.push(cell)
    }

    let writeRow = size - 1
    for (const candy of survivors) {
      next[writeRow][col] = candy
      writeRow -= 1
    }
    for (let row = writeRow; row >= 0; row -= 1) {
      next[row][col] = createCandy(randomType())
    }
  }

  return next
}

/** True when at least one adjacent swap would create a match. */
export function hasValidMove(board: Board): boolean {
  const size = board.length
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (col + 1 < size) {
        if (hasMatches(swap(board, { row, col }, { row, col: col + 1 }))) {
          return true
        }
      }
      if (row + 1 < size) {
        if (hasMatches(swap(board, { row, col }, { row: row + 1, col }))) {
          return true
        }
      }
    }
  }
  return false
}

/** Produces a fresh board that has no current matches and at least one move. */
export function createPlayableBoard(size: number = BOARD_SIZE): Board {
  let board = createBoard(size)
  let guard = 0
  while (!hasValidMove(board) && guard < 50) {
    board = createBoard(size)
    guard += 1
  }
  return board
}
