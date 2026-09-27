/**
 * i-am-a-card/index.tsx
 *
 * "I am a" card with a console / terminal typing effect.
 *
 * Cycles through locale keys under `i_am_a.*`, typing each word
 * character-by-character, holding, then clearing (backspace) before
 * moving to the next. Reads the active locale from the Jotai
 * languageAtom so it updates instantly when the user switches language.
 *
 * Hydrated client-side (client:load or client:visible).
 */

import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import clsx from "clsx";
import { languageAtom } from "@stores/info";
import { t } from "@lib/i18n";
import type { Locale } from "@lib/i18n";
import { CARD } from "@lib/classes";

// ---- Typing effect configuration -------------------------------------------

const TYPE_INTERVAL = 90; // ms per character typed
const ERASE_INTERVAL = 45; // ms per character erased
const HOLD_AFTER_TYPE = 1400; // ms to hold after fully typing
const HOLD_AFTER_ERASE = 250; // ms to hold after fully erased

// Locale keys cycled by the terminal
const DEFAULT_ROLE_KEYS = [
  "i_am_a.developer",
  "i_am_a.creative_technologist",
  "i_am_a.designer",
  "i_am_a.artist",
] as const;

// ---- Component --------------------------------------------------------------

export interface IAmACardProps {
  className?: string;
  /** Locale keys to cycle through in the terminal. */
  roles?: readonly string[];
  /** Accent color used for the prompt + cursor (a Tailwind class). */
  accentClassName?: string;
  /** Accent color used for the typed text (a Tailwind class). */
  textClassName?: string;
}

export default function IAmACard({
  className = "",
  roles = DEFAULT_ROLE_KEYS,
  accentClassName = "text-cyan-400",
  textClassName = "text-sky-300",
}: IAmACardProps): React.ReactElement {
  const [locale] = useAtom(languageAtom);
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Build the list of role strings for the current locale
    const roleStrings = roles.map((key) => t(locale as Locale, key));

    let cancelled = false;

    function typeNext(): void {
      if (cancelled) {
        return;
      }
      const role = roleStrings[indexRef.current % roleStrings.length];
      let charIndex = 0;

      function typeChar(): void {
        if (cancelled) {
          return;
        }
        charIndex++;
        setDisplayed(role.slice(0, charIndex));
        if (charIndex < role.length) {
          timeoutRef.current = setTimeout(typeChar, TYPE_INTERVAL);
        } else {
          // Fully typed — hold, then start erasing
          timeoutRef.current = setTimeout(eraseChar, HOLD_AFTER_TYPE);
        }
      }

      function eraseChar(): void {
        if (cancelled) {
          return;
        }
        charIndex--;
        setDisplayed(role.slice(0, Math.max(0, charIndex)));
        if (charIndex > 0) {
          timeoutRef.current = setTimeout(eraseChar, ERASE_INTERVAL);
        } else {
          // Fully erased — advance index, hold, then type next
          indexRef.current++;
          timeoutRef.current = setTimeout(typeNext, HOLD_AFTER_ERASE);
        }
      }

      typeChar();
    }

    // Reset and start typing
    setDisplayed("");
    typeNext();

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return (): void => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(cursorInterval);
    };
  }, [locale, roles]);

  const heading = t(locale as Locale, "i_am_a.heading");

  const cardClasses = clsx(CARD, className);

  // Derive a background color class for the cursor from the accent text class
  // (e.g. "text-cyan-400" → "bg-cyan-400").
  const cursorBgClassName = accentClassName.replace("text-", "bg-");

  const cursorClasses = clsx(
    "inline-block w-[8px] self-stretch",
    cursorBgClassName,
    "transition-opacity duration-100",
    cursorVisible ? "opacity-100" : "opacity-0",
  );

  return (
    <div className={cardClasses}>
      {/* Terminal title bar */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span
          className={clsx(
            "ml-2 font-mono text-xs",
            "text-[var(--color-fg-muted)]",
          )}
        >
          ~/whoami
        </span>
      </div>

      {/* Terminal body */}
      <div className="font-mono text-sm leading-relaxed">
        <div className="mb-2 text-[var(--color-fg-muted)]">
          <span className={accentClassName}>$</span> {heading}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={accentClassName}>{">"}</span>
          <span className={textClassName}>{displayed}</span>
          <span className={cursorClasses} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
