/**
 * dot-matrix-background/index.tsx
 *
 * Full-viewport dot-matrix particle background.
 *
 * - 2px dot diameter, 20px spacing between dots.
 * - Cyan-blue gradient color.
 * - Desktop: dots grow toward a 100px-diameter sphere around the mouse cursor.
 * - Mobile:  dots grow toward a 50px-diameter sphere around touch points.
 * - Smooth ease-in / ease-out (0.2s) grow & shrink.
 *
 * Rendered as a fixed, full-screen canvas behind all content.
 * Hydrated client-side only (client:only="react").
 */

import { useEffect, useRef } from "react";
import clsx from "clsx";

// ---- Configuration ----------------------------------------------------------

const DOT_RADIUS = 1; // 2px diameter → 1px radius
const SPACING = 20; // 20px between dots
const GROW_RADIUS_DESKTOP = 50; // 100px diameter → 50px radius
const GROW_RADIUS_MOBILE = 25; // 50px diameter → 25px radius
const EASE_DURATION = 0.2; // 0.2s ease-in-out
const MAX_DOT_RADIUS = 50; // cap so a single dot never exceeds ~100px diameter

// ---- Gradient presets -------------------------------------------------------

export type GradientPreset = "cyan-blue" | "yellow-orange" | "red-pink";

const GRADIENT_PRESETS: Record<
  GradientPreset,
  Array<{ stop: number; color: [number, number, number] }>
> = {
  // Cyan → sky blue → blue
  "cyan-blue": [
    { stop: 0, color: [0, 255, 213] }, // cyan
    { stop: 0.5, color: [56, 189, 248] }, // sky blue
    { stop: 1, color: [59, 130, 246] }, // blue
  ],
  // Yellow → orange → amber-red
  "yellow-orange": [
    { stop: 0, color: [253, 224, 71] }, // yellow
    { stop: 0.5, color: [249, 115, 22] }, // orange
    { stop: 1, color: [239, 68, 68] }, // red
  ],
  // Red → rose → pink
  "red-pink": [
    { stop: 0, color: [239, 68, 68] }, // red
    { stop: 0.5, color: [244, 63, 94] }, // rose
    { stop: 1, color: [236, 72, 153] }, // pink
  ],
};

// ---- Types ------------------------------------------------------------------

interface Dot {
  x: number;
  y: number;
  /** current animated radius (px) */
  r: number;
  /** target radius (px) */
  tr: number;
}

interface Pointer {
  x: number;
  y: number;
  active: boolean;
}

// ---- Helpers ----------------------------------------------------------------

/** Linear interpolation. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Frame-rate-independent exponential approach toward a target.
 * `halfLife` is the time (seconds) to close half the remaining distance.
 * This produces a smooth ease-in / ease-out feel ≈ 0.2s settle time.
 */
function approach(
  current: number,
  target: number,
  dt: number,
  halfLife: number,
): number {
  if (halfLife <= 0) {
    return target;
  }
  const alpha = 1 - 2 ** (-dt / halfLife);
  return lerp(current, target, alpha);
}

/** Sample a gradient (defined by its stops) at position `t` (0–1). */
function sampleGradient(
  t: number,
  stops: Array<{ stop: number; color: [number, number, number] }>,
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (clamped >= a.stop && clamped <= b.stop) {
      const localT = (clamped - a.stop) / (b.stop - a.stop);
      return [
        Math.round(lerp(a.color[0], b.color[0], localT)),
        Math.round(lerp(a.color[1], b.color[1], localT)),
        Math.round(lerp(a.color[2], b.color[2], localT)),
      ];
    }
  }
  const last = stops[stops.length - 1].color;
  return [last[0], last[1], last[2]];
}

/** Detect mobile / touch device. */
function isTouchDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

// ---- Component --------------------------------------------------------------

export interface DotMatrixBackgroundProps {
  className?: string;
  /** Gradient color preset. Defaults to `cyan-blue`. */
  gradient?: GradientPreset;
}

export default function DotMatrixBackground({
  className = "",
  gradient = "cyan-blue",
}: DotMatrixBackgroundProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientStops = GRADIENT_PRESETS[gradient] ?? GRADIENT_PRESETS["cyan-blue"];

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return;
    }
    const context = canvasEl.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    // Capture as non-null locals so closures retain the narrowing.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const touch = isTouchDevice();
    const growRadius = touch ? GROW_RADIUS_MOBILE : GROW_RADIUS_DESKTOP;

    // --- State ---------------------------------------------------------------
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointers = new Map<number, Pointer>();

    // half-life for the exponential approach ≈ 0.2s perceived settle
    const halfLife = EASE_DURATION / 3;

    // --- Build dot grid ------------------------------------------------------
    function buildGrid(): void {
      dots = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      // Center the grid so dots are evenly distributed
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: offsetX + c * SPACING,
            y: offsetY + r * SPACING,
            r: DOT_RADIUS,
            tr: DOT_RADIUS,
          });
        }
      }
    }

    // --- Resize --------------------------------------------------------------
    function resize(): void {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    // --- Pointer handlers ----------------------------------------------------
    function onPointerMove(e: PointerEvent): void {
      let p = pointers.get(e.pointerId);
      if (!p) {
        p = { x: e.clientX, y: e.clientY, active: true };
        pointers.set(e.pointerId, p);
      }
      p.x = e.clientX;
      p.y = e.clientY;
      p.active = true;
    }

    function onPointerDown(e: PointerEvent): void {
      pointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        active: true,
      });
    }

    function onPointerUp(e: PointerEvent): void {
      const p = pointers.get(e.pointerId);
      if (p) {
        p.active = false;
      }
    }

    function onPointerLeave(e: PointerEvent): void {
      const p = pointers.get(e.pointerId);
      if (p) {
        p.active = false;
      }
    }

    // --- Animation loop ------------------------------------------------------
    let lastTime = performance.now();
    let raf = 0;

    function render(): void {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp dt to 50ms
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Collect active pointer positions
      const activePointers: Array<{ x: number; y: number }> = [];
      for (const p of pointers.values()) {
        if (p.active) {
          activePointers.push({ x: p.x, y: p.y });
        }
      }

      // Diagonal length for gradient normalization
      const diag = Math.sqrt(width * width + height * height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Compute target radius based on nearest active pointer
        let targetR = DOT_RADIUS;
        if (activePointers.length > 0) {
          let minDist = Infinity;
          for (let j = 0; j < activePointers.length; j++) {
            const dx = dot.x - activePointers[j].x;
            const dy = dot.y - activePointers[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
            }
          }
          if (minDist < growRadius) {
            // Smooth falloff: dots at center grow to MAX_DOT_RADIUS,
            // dots at edge of influence stay at DOT_RADIUS.
            const falloff = 1 - minDist / growRadius;
            // Ease the falloff for a nicer sphere look
            const eased = falloff * falloff * (3 - 2 * falloff); // smoothstep
            targetR = lerp(DOT_RADIUS, MAX_DOT_RADIUS, eased);
          }
        }

        dot.tr = targetR;
        // Animate current radius toward target (ease-in/out 0.2s)
        dot.r = approach(dot.r, dot.tr, dt, halfLife);

        // Skip drawing tiny dots that are at base size (perf optimization)
        if (dot.r <= DOT_RADIUS + 0.1 && dot.tr <= DOT_RADIUS + 0.1) {
          // Draw base dot
          const t = (dot.x + dot.y) / diag;
          const [cr, cg, cb] = sampleGradient(t, gradientStops);
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.35)`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw grown dot with glow
          const t = (dot.x + dot.y) / diag;
          const [cr, cg, cb] = sampleGradient(t, gradientStops);
          const intensity = Math.min(
            1,
            (dot.r - DOT_RADIUS) / (MAX_DOT_RADIUS - DOT_RADIUS),
          );
          const alpha = 0.35 + intensity * 0.65;

          // Glow halo for larger dots
          if (dot.r > DOT_RADIUS * 2) {
            const glow = ctx.createRadialGradient(
              dot.x,
              dot.y,
              0,
              dot.x,
              dot.y,
              dot.r * 1.8,
            );
            glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.4})`);
            glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r * 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(render);
    }

    // --- Init ----------------------------------------------------------------
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    lastTime = performance.now();
    render();

    // --- Cleanup -------------------------------------------------------------
    return (): void => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("pointerleave", onPointerLeave);
      pointers.clear();
    };
  }, [gradientStops]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx("fixed inset-0 -z-10 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
