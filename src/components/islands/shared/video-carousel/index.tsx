/**
 * video-carousel/index.tsx
 *
 * Infinite horizontal carousel of YouTube highlight embeds.
 *
 *  - One slide visible at a time (full-width 16:9 embed).
 *  - Seamless infinite loop via cloned first / last slides.
 *  - Desktop: prev / next chevron navigation buttons.
 *  - Mobile:  swipe gestures (touchstart / touchend).
 *  - Real slides render a live YouTube iframe; the two clones render a
 *    lightweight thumbnail so at most N live players are mounted.
 *  - Accent colour matches the page's dot-matrix gradient preset.
 *
 * Hydrated client-side (client:load or client:visible).
 */

import type { GradientPreset } from "@components/islands/shared/dot-matrix-background";
import { CARD } from "@lib/classes";
import { useTranslation } from "@lib/i18n";
import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import CarouselTrack from "./carousel-track";
import type { CarouselTrackSlide } from "./carousel-track";
import SlideIndicatorList from "./slide-indicator-list";

const VIDEOS = [
  { id: "LdL6Z86winM", title: "YouTube video player" },
  { id: "SXpdaeYv9oE", title: "YouTube video player" },
  { id: "6r_ZJT_htuo", title: "YouTube video player" },
];

const ACCENT_BY_GRADIENT: Record<GradientPreset, string> = {
  "cyan-blue": "text-cyan-400",
  "yellow-orange": "text-orange-400",
  "red-pink": "text-rose-400",
};

const ACCENT_BG_BY_GRADIENT: Record<GradientPreset, string> = {
  "cyan-blue": "bg-cyan-400",
  "yellow-orange": "bg-orange-400",
  "red-pink": "bg-rose-400",
};

const SWIPE_THRESHOLD = 50;

// Astro islands are server-rendered, where useLayoutEffect warns. Use the
// isomorphic variant so SSR uses useEffect (no-op) while the client still
// measures before paint to avoid a layout flash.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Desktop: each highlight tile is a fixed width so the previous / next tiles
// peek on either side of the centred active tile (dimmed). Below the
// breakpoint we fall back to a single full-width slide (mobile).
const TILE_WIDTH = 600;
const TILE_GAP = 50;
const DESKTOP_BREAKPOINT = 640;

export interface VideoCarouselProps {
  className?: string;
  gradient?: GradientPreset;
}

export default function VideoCarousel({
  className = "",
  gradient = "cyan-blue",
}: VideoCarouselProps): React.ReactElement {
  const { t } = useTranslation();
  const accent = ACCENT_BY_GRADIENT[gradient];
  const accentBg = ACCENT_BG_BY_GRADIENT[gradient];

  // Cloned first & last slides make the loop seamless. Each slide is
  // tagged `isClone` so we can render a lightweight thumbnail for clones
  // and derive a stable, index-free React key.
  const slides: CarouselTrackSlide[] = [
    { ...VIDEOS[VIDEOS.length - 1], isClone: true },
    ...VIDEOS.map((video) => ({ ...video, isClone: false })),
    { ...VIDEOS[0], isClone: true },
  ];
  const lastIndex = slides.length - 1;

  const [pos, setPos] = useState(1); // start on the first real slide
  const [noTransition, setNoTransition] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Measure the carousel viewport (before paint) so we can centre the active
  // 600 px tile on desktop with dimmed neighbours peeking on each side, while
  // falling back to a single full-width slide on mobile.
  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Real-slide index (0-based) that the current position represents,
  // accounting for the clones on either end.
  const realIndex =
    (((pos - 1) % VIDEOS.length) + VIDEOS.length) % VIDEOS.length;

  // Desktop renders fixed-width tiles so neighbours peek on each side;
  // mobile renders a single full-width slide.
  const isDesktop = containerWidth >= DESKTOP_BREAKPOINT;
  const slideWidth = isDesktop ? TILE_WIDTH : containerWidth;
  // Desktop tiles are separated by a fixed gap so neighbours peek with
  // breathing room between them.
  const gap = isDesktop ? TILE_GAP : 0;
  // Translate so the active tile is centred within the viewport. The gap is
  // included in the per-step travel so each tile lands centred.
  const offset = (containerWidth - slideWidth) / 2 - pos * (slideWidth + gap);

  const goTo = useCallback((target: number) => {
    setNoTransition(false);
    setPos(target);
  }, []);

  const next = useCallback(() => {
    goTo(pos + 1);
  }, [goTo, pos]);

  const prev = useCallback(() => {
    goTo(pos - 1);
  }, [goTo, pos]);

  // When a transition lands on a clone, snap back to the matching real
  // slide instantly (no animation) so the loop is seamless.
  const handleTransitionEnd = useCallback(() => {
    if (pos === 0) {
      setNoTransition(true);
      setPos(VIDEOS.length);
    } else if (pos === lastIndex) {
      setNoTransition(true);
      setPos(1);
    }
  }, [lastIndex, pos]);

  // Re-arm the transition one frame after a snap so the next navigation
  // animates smoothly.
  useEffect(() => {
    if (!noTransition) {
      return;
    }
    const id = requestAnimationFrame(() => {
      setNoTransition(false);
    });
    return () => {
      cancelAnimationFrame(id);
    };
  }, [noTransition]);

  // Begin a drag: capture the start X, disable the transition so the track
  // can follow the finger instantly.
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    if (touchStartX.current !== null) {
      setIsDragging(true);
      setDragOffset(0);
    }
  }, []);

  // Live drag: update the pixel delta every move so the carousel tracks the
  // gesture 1:1 instead of waiting for release.
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const currentX = e.touches[0]?.clientX ?? touchStartX.current;
    setDragOffset(currentX - touchStartX.current);
  }, []);

  // End the drag: commit to next / prev if the gesture crossed the threshold,
  // otherwise snap back to the current slide.
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) {
        return;
      }
      const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
      const delta = endX - touchStartX.current;
      touchStartX.current = null;
      setIsDragging(false);
      setDragOffset(0);
      if (delta <= -SWIPE_THRESHOLD) {
        next();
      } else if (delta >= SWIPE_THRESHOLD) {
        prev();
      }
    },
    [next, prev],
  );

  return (
    <section className={clsx(CARD, "select-none", className)}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className={clsx("font-mono text-base font-medium", accent)}>
          {t("highlights.title")}
        </h2>
        <span className={clsx("font-mono text-xs", accent)}>
          {realIndex + 1} / {VIDEOS.length}
        </span>
      </header>

      <div
        ref={containerRef}
        className={clsx(
          "relative overflow-hidden rounded-lg border border-white/10",
          "touch-pan-y",
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex"
          style={{
            gap: gap ? `${gap}px` : undefined,
            transform: `translateX(${offset + dragOffset}px)`,
            transition:
              noTransition || isDragging ? "none" : "transform 0.4s ease",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <CarouselTrack
            slides={slides}
            pos={pos}
            slideWidth={slideWidth}
            accent={accent}
          />
        </div>

        {/* Desktop navigation buttons */}
        <button
          type="button"
          onClick={prev}
          aria-label={t("highlights.previous")}
          className={clsx(
            "absolute left-2 top-1/2 hidden -translate-y-1/2",
            "flex h-10 w-10 items-center justify-center rounded-full",
            "border border-white/10 bg-[#0d0d18]/80 backdrop-blur-sm",
            "transition-colors hover:bg-white/10 sm:flex",
            accent,
          )}
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label={t("highlights.next")}
          className={clsx(
            "absolute right-2 top-1/2 hidden -translate-y-1/2",
            "flex h-10 w-10 items-center justify-center rounded-full",
            "border border-white/10 bg-[#0d0d18]/80 backdrop-blur-sm",
            "transition-colors hover:bg-white/10 sm:flex",
            accent,
          )}
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="mt-4 flex justify-center gap-2">
        <SlideIndicatorList
          videos={VIDEOS}
          realIndex={realIndex}
          accentBg={accentBg}
          goToLabel={(index) =>
            t("highlights.goto").replace("{n}", String(index + 1))
          }
          onSelect={(index) => goTo(index + 1)}
        />
      </div>
    </section>
  );
}
