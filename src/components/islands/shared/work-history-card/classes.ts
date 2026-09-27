/**
 * classes.ts
 * Tailwind class constants specific to the WorkHistoryCard component.
 */
import clsx from "clsx";

/** Timeline item row (dot + line + content). */
export const TIMELINE_ITEM = "relative flex gap-4 pb-6 last:pb-0";

/** Timeline dot. */
export const TIMELINE_DOT = clsx(
  "mt-1.5 h-3 w-3 shrink-0 rounded-full",
  "border-2 border-cyan-400/60 bg-[#0d0d18]",
  "transition-colors hover:border-cyan-400",
);

/** Timeline vertical line (pseudo-element via class). */
export const TIMELINE_LINE = clsx(
  "absolute left-[5px] top-4 bottom-0 w-px",
  "bg-gradient-to-b from-cyan-400/40 to-transparent",
);

/** Timeline content (company name + period). */
export const TIMELINE_CONTENT = clsx(
  "flex-1 cursor-pointer rounded-md p-2",
  "transition-colors hover:bg-white/5",
);

/** Company name in timeline. */
export const COMPANY_NAME = clsx(
  "font-mono text-base font-medium text-[var(--color-fg)]",
  "transition-colors hover:text-cyan-400",
);
