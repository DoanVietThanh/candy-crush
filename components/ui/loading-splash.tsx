const LoadingSplash = () => {
  return (
    <div className="ls-stripes relative grid h-full place-items-center">
      <div className="absolute inset-0 bg-white/75" />
      <div className="relative flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/VectorSmartObject_1.png"
          alt="Life Savers"
          className="ls-spin w-24 opacity-90"
        />
        <p className="text-xs font-bold tracking-[0.3em] text-(--ls-blue)/70">
          LOADING…
        </p>
      </div>
    </div>
  )
}

export default LoadingSplash
