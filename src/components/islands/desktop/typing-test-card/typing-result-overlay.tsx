/**
 * typing-test-card/typing-result-overlay.tsx
 *
 * Result overlay shown over the typing window once the 60s test finishes.
 * Returns null until the test is finished.
 */
import { MUTED_MONO } from "./classes";
import clsx from "clsx";

export interface TypingResultOverlayProps {
  status: "idle" | "running" | "finished";
  finishedLabel: string;
  wpmLabel: string;
  accuracyLabel: string;
  wordsLabel: string;
  finishedWpm: number;
  liveAccuracy: number;
  wordCount: number;
}

export default function TypingResultOverlay({
  status,
  finishedLabel,
  wpmLabel,
  accuracyLabel,
  wordsLabel,
  finishedWpm,
  liveAccuracy,
  wordCount,
}: TypingResultOverlayProps): React.ReactElement | null {
  if (status !== "finished") {
    return null;
  }

  return (
    <div
      className={clsx(
        "absolute inset-0 flex items-center justify-center",
        "gap-8 bg-black/55 backdrop-blur-[1px]",
      )}
    >
      <p className={clsx(MUTED_MONO, "text-cyan-400")}>{finishedLabel}</p>
      <div className="flex items-baseline gap-2">
        <span
          className={clsx(
            "font-mono text-4xl font-semibold",
            "text-[var(--color-fg)]",
          )}
        >
          {finishedWpm}
        </span>
        <span className="font-mono text-xs text-[var(--color-fg-muted)]">
          {wpmLabel}
        </span>
      </div>
      <div
        className={clsx(
          "flex gap-4 font-mono text-xs",
          "text-[var(--color-fg)]",
        )}
      >
        <span>
          {accuracyLabel}: {liveAccuracy}%
        </span>
        <span>
          {wordsLabel}: {wordCount}
        </span>
      </div>
    </div>
  );
}
