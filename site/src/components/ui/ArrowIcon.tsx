/** Стрелка «перейти». Тот же штрих 2 px, что у стрелки select и плюса FAQ. */
export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`inline-block size-4 ${className}`}>
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
