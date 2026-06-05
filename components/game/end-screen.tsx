"use client"

import { track } from "@/lib/analytics"

interface EndScreenProps {
  score: number
  onReplay: () => void
}

const CTA_URL = "https://www.life-savers.com/"

export function EndScreen({ score, onReplay }: EndScreenProps) {
  const handleCta = () => {
    track("cta_clicked")
    window.open(CTA_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="ls-stripes relative h-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(95% 75% at 50% 40%, rgb(255 255 255 / 0.94) 0%, rgb(255 255 255 / 0.8) 50%, rgb(255 255 255 / 0.2) 100%)",
        }}
      />

      <div className="ls-fade-in relative flex h-full flex-col items-center justify-center px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/VectorSmartObject_1.png"
          alt="Life Savers"
          className="w-[58%] max-w-[230px] drop-shadow-md"
        />

        <h1 className="mt-5 text-3xl font-black tracking-tight text-(--ls-blue) drop-shadow-sm">
          AWESOME JOB!
        </h1>

        <div className="mt-4 rounded-3xl bg-(--ls-blue) px-8 py-4 text-white shadow-xl">
          <p className="text-[11px] font-bold tracking-[0.3em] opacity-80">
            FINAL SCORE
          </p>
          <p className="text-5xl leading-none font-black tabular-nums">
            {score.toLocaleString()}
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Product.png"
          alt="Life Savers candy"
          className="ls-float mt-6 w-40 max-w-[55vw] drop-shadow-2xl"
        />

        <button
          type="button"
          onClick={handleCta}
          aria-label="Buy now"
          className="ls-press ls-cta mt-6 inline-block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/buynox.png"
            alt="Buy Now"
            draggable={false}
            className="w-52 max-w-[64vw] drop-shadow-xl"
          />
        </button>

        <button
          type="button"
          onClick={onReplay}
          className="ls-press mt-4 text-sm font-extrabold tracking-widest text-(--ls-blue)/80 underline-offset-4 hover:underline"
        >
          ↺ PLAY AGAIN
        </button>
      </div>
    </div>
  )
}
