"use client"

interface HeaderProps {
  score: number
  timeLeft: number
}

/** The blue score/time bar that sits under the Life Savers banner.
 * Matches the reference art: "SCORE" label, a white value pill, and a
 * yellow MM:SS countdown — all inside one rounded blue bar. */
export function Header({ score, timeLeft }: HeaderProps) {
  const urgent = timeLeft <= 5
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const ss = String(timeLeft % 60).padStart(2, "0")

  return (
    <div className="ls-scorebar">
      <span className="ls-scorebar-label">SCORE</span>
      <span className="ls-scorebar-pill tabular-nums">
        {score.toLocaleString()}
      </span>
      <span
        className={`ls-scorebar-time tabular-nums ${urgent ? "ls-scorebar-time-urgent" : ""}`}
      >
        {mm} : {ss}
      </span>
    </div>
  )
}
