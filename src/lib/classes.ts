/**
 * classes.ts
 * Tailwind class constants shared with Astro layouts, pages, and dom
 * components (and, for the Astro↔island-shared ones, with island components).
 *
 * Island-only and cross-island classes have been distributed into the
 * corresponding island component folders (and islands/shared/classes.ts).
 */
import clsx from "clsx";

// ── Card ──────────────────────────────────────────────────────
/** Standard card wrapper (rounded, bordered, semi-transparent). */
export const CARD = clsx(
  "relative overflow-hidden rounded-lg border border-white/10",
  "bg-[#0d0d18]/80 p-6 backdrop-blur-sm",
);

// ── Typography ────────────────────────────────────────────────
/** Accent heading (cyan, mono, small). */
export const ACCENT_HEADING = "font-mono text-base font-medium text-cyan-400";

/** Large accent heading (cyan, mono, for page titles). */
export const ACCENT_HEADING_LG = clsx(
  "font-mono text-2xl font-semibold tracking-tight",
  "text-cyan-400 sm:text-3xl",
);

/** Body text with muted colour. */
export const BODY_MUTED = clsx(
  "max-w-[65ch] leading-relaxed",
  "text-[var(--color-fg-muted)]",
);

/** Body text with default colour. */
export const BODY = clsx(
  "text-base leading-relaxed text-[var(--color-fg)]",
  "sm:text-base",
);

// ── Layout ───────────────────────────────────────────────────
/** Standard article container (centred, responsive padding). */
export const ARTICLE = "mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8";

/** Wider article container for project detail pages. */
export const ARTICLE_WIDE = clsx(
  "mx-auto flex max-w-4xl flex-col gap-8",
  "px-4 py-16 sm:px-6 lg:px-8",
);

/** Back-link style (mono, muted, hover transition). */
export const BACK_LINK = clsx(
  "font-mono text-base text-[var(--color-fg-muted)]",
  "transition-colors hover:text-[var(--color-fg)]",
);

/** Project cover image. */
export const COVER_IMG = clsx(
  "aspect-[16/10] w-full rounded-lg",
  "bg-[var(--color-bg-elevated)] object-cover",
);

/** Flex header with wrap (for project detail). */
export const FLEX_HEADER = clsx(
  "flex flex-wrap items-baseline justify-between",
  "gap-4",
);

// ── Shell / Page ─────────────────────────────────────────────
/** Desktop shell grid container. */
export const DESKTOP_SHELL = clsx(
  "desktop-shell relative mx-auto hidden min-h-screen",
  "max-w-[1920px]",
  "grid-cols-[minmax(240px,1fr)_minmax(0,4fr)_minmax(240px,1fr)]",
  "grid-rows-[auto_1fr_auto] gap-8",
  "px-[clamp(1rem,4vw,4rem)] py-8 lg:grid",
);

/** Desktop aside column. */
export const DESKTOP_ASIDE = clsx(
  "col-start-1 col-end-2 self-start",
  "lg:sticky lg:top-16",
);

/** Mobile shell flex container. */
export const MOBILE_SHELL = clsx(
  "mobile-shell flex min-h-screen flex-col gap-5",
  "px-5 py-3 lg:hidden",
);

/** Main content wrapper (index page). */
export const MAIN = clsx(
  "relative z-10 mx-auto min-h-screen max-w-7xl",
  "px-4 py-6 sm:px-6 lg:px-8",
);

/** Header bar (index page). */
export const HEADER_BAR = clsx(
  "mb-8 flex items-center justify-between rounded-lg",
  "border border-white/10 bg-[#0d0d18]/60 px-4 py-3",
  "backdrop-blur-sm sm:mb-12",
);

/** Brand text (index page). */
export const BRAND = clsx(
  "font-mono text-base font-semibold tracking-tight",
  "text-[var(--color-fg)] sm:text-base",
);

// ── Work History ──────────────────────────────────────────────
/** Second row grid: 1/3 left + 2/3 right (desktop), stacked (mobile). */
export const SECOND_ROW = "grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3";

/** Left column (1/3) in the second row. */
export const SECOND_ROW_LEFT = "lg:col-span-1";

/** Right column (2/3) in the second row. */
export const SECOND_ROW_RIGHT = "lg:col-span-2";

/** Third row: full-width card, spaced below the second row. */
export const THIRD_ROW = "mt-4 sm:mt-6";

/** Desktop-only wrapper (hidden below the `lg` breakpoint). */
export const DESKTOP_ONLY = "hidden lg:block";
