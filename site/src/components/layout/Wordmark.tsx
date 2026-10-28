import Link from "next/link";

/** Вордмарк: ссылка высотой 44 px, слова стоят на общей базовой линии. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center leading-none ${className}`}
      aria-label="VYRA Digital — на главную"
    >
      <span className="inline-flex items-baseline gap-1.5">
        <span className="font-display text-[length:var(--text-lead)] font-normal">VYRA</span>{" "}
        <span>Digital</span>
      </span>
    </Link>
  );
}
