import Link from "next/link";

export function Logo() {
  return (
    <Link
      aria-label="mindfull home"
      className="inline-flex items-baseline font-logo text-[1.9rem] leading-none font-black tracking-[-0.01em] text-primary md:text-[2.6rem]"
      href="/"
    >
      <span aria-hidden="true" className="inline-flex items-baseline">
        m
        <span className="relative">
          ı
          <svg
            aria-hidden="true"
            className="absolute top-[0.06em] left-1/2 w-[0.3em] -translate-x-1/2 text-handle-blue"
            fill="currentColor"
            viewBox="0 0 24 22"
          >
            <path d="M12 21.5 2.6 12.4A6 6 0 0 1 12 4.6a6 6 0 0 1 9.4 7.8Z" />
          </svg>
        </span>
        ndf
        <svg
          aria-hidden="true"
          className="mx-[0.03em] h-[0.5em] w-[0.6em] text-handle-blue"
          fill="none"
          viewBox="0 0 60 50"
        >
          <circle cx="8" cy="8" fill="currentColor" r="7" />
          <circle cx="52" cy="8" fill="currentColor" r="7" />
          <path
            d="M10 26 Q30 52 50 26"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        ll
      </span>
    </Link>
  );
}
