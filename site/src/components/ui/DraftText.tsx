import { DRAFT, isDraftText } from "@/content/draft";

/** Обычный текст — абзацем; черновик — плашкой, чтобы заглушку нельзя было принять за факт. */
export function DraftText({ text, className = "" }: { text: string; className?: string }) {
  if (!isDraftText(text)) return <p className={className}>{text}</p>;

  return (
    <p className={`rounded-ui bg-draft/15 px-4 py-3 text-fg ${className}`}>
      <span className="font-semibold text-draft">Черновик.</span> {text.slice(DRAFT.length).trim()}
    </p>
  );
}
