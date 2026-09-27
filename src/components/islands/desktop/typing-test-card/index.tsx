/**
 * typing-test-card/index.tsx
 * 60-second words-per-minute typing test (desktop only).
 *
 * Behaviour:
 *  - Random English words come from the `random-words` library.
 *  - Two text lines are always visible. As the cursor advances to the next
 *    line, the previous line scrolls out, the next moves up, and a new line
 *    appears beneath it (infinite scrolling window).
 *  - Characters turn green (correct) or red (incorrect) as you type.
 *  - The test starts on the first keystroke; live stats show WPM, accuracy,
 *    time remaining, and a completed-word counter.
 *  - A result panel is shown when the 60s elapse.
 *
 * Hydrated client-side (client:load). Hidden below the `lg` breakpoint by the
 * wrapping row in `index.astro`.
 */
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import clsx from "clsx";
import { generate } from "random-words";
import { useTranslation } from "@lib/i18n";
import { CARD, ACCENT_HEADING } from "@lib/classes";
import { MUTED_MONO } from "./classes";

/** Test duration, in seconds. */
const TEST_DURATION = 60;
/** Number of words generated per batch. */
const BATCH_SIZE = 120;

type Status = "idle" | "running" | "finished";

/** Generate a fresh batch of random English words. */
function makeWords(): string[] {
  return generate({ exactly: BATCH_SIZE }) as string[];
}

/** Count correctly-typed characters (position-wise). */
function countCorrect(typed: string, target: string): number {
  let n = 0;
  const len = Math.min(typed.length, target.length);
  for (let i = 0; i < len; i++) {
    if (typed.at(i) === target.at(i)) {
      n++;
    }
  }
  return n;
}

export default function TypingTestCard() {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Status>("idle");
  const [words, setWords] = useState<string[]>(() => makeWords());
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Layout refs / state for the scrolling two-line window.
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  // Mirror of `typed` so the interval timer can read the latest value.
  const typedRef = useRef("");
  // Mirror of `status` so the global keyboard listener can read it.
  const statusRef = useRef<Status>("idle");

  const [translateY, setTranslateY] = useState(0);
  const [lineHeight, setLineHeight] = useState(40);

  /** The full target string to type (words joined by single spaces). */
  const target = useMemo(() => words.join(" "), [words]);

  const correctChars = useMemo(
    () => countCorrect(typed, target),
    [typed, target],
  );

  /** Completed words = number of space boundaries passed in the target. */
  const wordCount = useMemo(() => {
    const slice = target.slice(0, typed.length);
    let n = 0;
    for (let i = 0; i < slice.length; i++) {
      if (slice.at(i) === " ") {
        n++;
      }
    }
    return n;
  }, [typed, target]);

  // Keep typed and status mirrors in sync.
  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Append more words before the user runs out of text.
  useEffect(() => {
    if (typed.length > target.length * 0.75) {
      setWords((prev) => [...prev, ...makeWords()]);
    }
  }, [typed.length, target.length]);

  /** Measure the current character's line and scroll the window on. */
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) {
      return;
    }

    const spans = el.children;
    if (spans.length === 0) {
      return;
    }

    // Detect distinct line tops to compute the line height.
    const tops = new Set<number>();
    for (let i = 0; i < spans.length; i++) {
      tops.add((spans[i] as HTMLElement).offsetTop);
    }
    const sorted = [...tops].sort((a, b) => a - b);
    if (sorted.length >= 2) {
      setLineHeight(sorted[1] - sorted[0]);
    } else if (sorted.length === 1) {
      const h = (spans[0] as HTMLElement).offsetHeight || 38;
      setLineHeight(h);
    }

    // Scroll so the cursor's line sits at the top of the visible window.
    const cursorIdx = Math.min(typed.length, target.length - 1);
    const span = spans[cursorIdx] as HTMLElement | undefined;
    const top = span ? span.offsetTop : 0;
    setTranslateY(-top);
  }, [typed.length, target]);

  // Countdown + live WPM/accuracy timer.
  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const id = window.setInterval(() => {
      const start = startTimeRef.current;
      if (start == null) {
        return;
      }
      const elapsed = (performance.now() - start) / 1000;
      const left = Math.max(0, TEST_DURATION - elapsed);
      setTimeLeft(left);

      const cur = typedRef.current;
      const correct = countCorrect(cur, target);
      const mins = Math.max(elapsed, 1) / 60;
      setWpm(Math.round(correct / 5 / mins));
      setAccuracy(
        cur.length > 0 ? Math.round((correct / cur.length) * 100) : 100,
      );

      if (left <= 0) {
        // Final results.
        const finalCorrect = countCorrect(cur, target);
        setWpm(Math.round(finalCorrect / 5)); // 60s == 1 minute
        setAccuracy(
          cur.length > 0 ? Math.round((finalCorrect / cur.length) * 100) : 100,
        );
        setTimeLeft(0);
        setStatus("finished");
        window.clearInterval(id);
      }
    }, 100);

    return () => window.clearInterval(id);
  }, [status, target]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const startTest = useCallback(() => {
    startTimeRef.current = performance.now();
    statusRef.current = "running";
    setStatus("running");
  }, []);

  const restart = useCallback(() => {
    startTimeRef.current = null;
    setWords(makeWords());
    setTyped("");
    typedRef.current = "";
    statusRef.current = "idle";
    setTimeLeft(TEST_DURATION);
    setWpm(0);
    setAccuracy(100);
    setStatus("idle");
    // Refocus on the next frame after the input re-renders.
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // Global keyboard shortcut: Ctrl+Shift+Enter starts the test from
  // anywhere on the page, without requiring the input to be focused.
  // When the test is finished, it restarts instead.
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        if (statusRef.current === "idle") {
          startTest();
          inputRef.current?.focus();
        } else if (statusRef.current === "finished") {
          restart();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [startTest, restart]);

  /** Capture keystrokes; typing only works once the test is running. */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (status === "finished") {
        return;
      }

      // While idle, ignore all keys (the global listener handles start).
      if (status === "idle") {
        return;
      }

      const { key } = e;
      if (key === "Backspace") {
        e.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      // Ignore modifier combos and non-printable keys (Enter, arrows, …).
      if (e.ctrlKey || e.metaKey || e.altKey || key.length !== 1) {
        return;
      }

      e.preventDefault();

      setTyped((prev) => {
        if (prev.length >= target.length) {
          return prev;
        }
        return prev + key;
      });
    },
    [status, target],
  );

  const liveAccuracy =
    status === "finished"
      ? accuracy
      : typed.length > 0
        ? Math.round((correctChars / typed.length) * 100)
        : 100;
  const finishedWpm = status === "finished" ? wpm : 0;

  return (
    <div className={clsx(CARD, "overflow-visible h-full select-none")}>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className={clsx(ACCENT_HEADING)}>{t("typing_test.title")}</h2>
        <div className="flex items-center gap-4 font-mono text-xs">
          <Stat
            label={t("typing_test.time")}
            value={`${Math.ceil(timeLeft)}s`}
          />
          <Stat label={t("typing_test.wpm")} value={`${wpm}`} />
          <Stat
            label={t("typing_test.accuracy")}
            value={`${liveAccuracy}%`}
          />
          <Stat label={t("typing_test.words")} value={`${wordCount}`} />
        </div>
      </div>

      {/* Two-line scrolling typing window */}
      <div
        className={clsx(
          "relative w-full cursor-default overflow-hidden rounded-md border",
          status === "running" ? "border-green-800" : "border-white/5",
          "bg-black/20 py-2.5",
        )}
        style={{ height: lineHeight * 2 + 14 }}
        onClick={focusInput}
        role="textbox"
        tabIndex={-1}
      >
        <div
          ref={innerRef}
          className={clsx(
            "relative whitespace-pre-wrap break-words px-4 py-3",
            "font-mono text-lg leading-[30px] transition-transform",
            "duration-200 ease-out",
          )}
          style={{ transform: `translateY(${translateY}px)` }}
        >
          {target.split("").map((ch, i) => {
            const typedCh = typed.at(i);
            let cls = "text-white/25"; // untyped
            if (i < typed.length) {
              cls =
                typedCh === ch
                  ? "text-emerald-400"
                  : ch === " "
                    ? "text-red-400 bg-red-500/20 rounded"
                    : "text-red-400";
            }
            const isCurrent = i === typed.length && status !== "finished";
            return (
              <span
                key={i}
                className={clsx(
                  cls,
                  isCurrent &&
                    "rounded bg-cyan-400/20 text-white animate-pulse",
                )}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </div>

        {/* Hidden input that owns keyboard focus & captures keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={() => {
            /* controlled — mutations happen in onKeyDown */
          }}
          onKeyDown={handleKeyDown}
          className={clsx(
            "absolute inset-0 h-full w-full",
            "cursor-default opacity-0",
          )}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={t("typing_test.title")}
        />

        {/* Finished result overlay */}
        {status === "finished" && (
          <div
            className={clsx(
              "absolute inset-0 flex items-center justify-center",
              "gap-8 bg-black/55 backdrop-blur-[1px]",
            )}
          >
            <p className={clsx(MUTED_MONO, "text-cyan-400")}>
              {t("typing_test.finished")}
            </p>
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
                {t("typing_test.wpm")}
              </span>
            </div>
            <div
              className={clsx(
                "flex gap-4 font-mono text-xs",
                "text-[var(--color-fg)]",
              )}
            >
              <span>
                {t("typing_test.accuracy")}: {liveAccuracy}%
              </span>
              <span>
                {t("typing_test.words")}: {wordCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer: hint */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className={clsx(MUTED_MONO, "truncate")}>
          {t("typing_test.hint")}
        </p>
      </div>
    </div>
  );
}

/** Small labelled stat used in the header row. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end leading-tight">
      <span
        className={clsx(
          "text-[10px] uppercase tracking-wide",
          "text-[var(--color-fg-muted)]",
        )}
      >
        {label}
      </span>
      <span className="text-base text-[var(--color-fg)]">{value}</span>
    </div>
  );
}
