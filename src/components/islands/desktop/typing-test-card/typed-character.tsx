/**
 * typing-test-card/typed-character.tsx
 *
 * A single character span in the typing test window, coloured by whether it
 * has been typed correctly, incorrectly, or not yet.
 */
import clsx from "clsx";

export interface TypedCharacterProps {
  ch: string;
  typedCh: string | undefined;
  isTyped: boolean;
  isCurrent: boolean;
}

export default function TypedCharacter({
  ch,
  typedCh,
  isTyped,
  isCurrent,
}: TypedCharacterProps): React.ReactElement {
  let cls = "text-white/25";
  if (isTyped) {
    if (typedCh === ch) {
      cls = "text-emerald-400";
    } else if (ch === " ") {
      cls = "text-red-400 bg-red-500/20 rounded";
    } else {
      cls = "text-red-400";
    }
  }
  return (
    <span
      className={clsx(
        cls,
        isCurrent && "rounded bg-cyan-400/20 text-white animate-pulse",
      )}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  );
}
