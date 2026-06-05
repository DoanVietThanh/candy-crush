"use client"

interface StartScreenProps {
  onPlay: () => void
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="ls-stripes relative h-full overflow-hidden">
      {/* Life Savers product bags + gummies scattered into the corners. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Product.png"
        alt=""
        draggable={false}
        className="ls-decor"
      />

      <div className="ls-fade-in relative flex h-full flex-col items-center justify-center px-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/VectorSmartObject_1.png"
          alt="Life Savers"
          className="w-[80%] max-w-[320px] drop-shadow-[0_6px_10px_rgba(20,56,122,0.45)]"
        />

        <button
          type="button"
          onClick={onPlay}
          aria-label="Play"
          className="ls-press ls-cta mt-8 inline-block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Playbutton.png"
            alt="Play"
            draggable={false}
            className="w-52 max-w-[64vw] drop-shadow-[0_8px_12px_rgba(20,56,122,0.5)]"
          />
        </button>
      </div>
    </div>
  )
}
