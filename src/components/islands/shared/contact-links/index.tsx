/**
 * contact-links/index.tsx
 *
 * Phone + email contact buttons rendered on the landing / role pages.
 * Icons are imported from `react-icons` so no custom SVG assets are
 * required. The icon tint matches the page's dot-matrix gradient preset.
 *
 * Hydrated client-side (client:load or client:visible).
 */

import clsx from "clsx";
import { FaSquarePhone, FaEnvelope } from "react-icons/fa6";
import type { GradientPreset } from "@components/islands/shared/dot-matrix-background";
import { contact } from "@lib/contact";

const ICON_CLASSES: Record<GradientPreset, string> = {
  "cyan-blue": "text-cyan-400",
  "yellow-orange": "text-orange-400",
  "red-pink": "text-rose-400",
};

export interface ContactLinksProps {
  className?: string;
  /** Gradient preset — should match the page's dot-matrix gradient. */
  gradient?: GradientPreset;
}

export default function ContactLinks({
  className = "",
  gradient = "cyan-blue",
}: ContactLinksProps): React.ReactElement {
  const iconClass = ICON_CLASSES[gradient];
  const buttonClass = clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg",
    "border border-white/10 bg-white/5 px-4 py-2",
    "font-mono text-sm text-[var(--color-fg)]",
    "transition-colors hover:bg-white/10",
  );

  return (
    <div
      className={clsx(
        "flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center",
        className,
      )}
    >
      <a href={`tel:${contact.phone}`} className={buttonClass}>
        <FaSquarePhone aria-hidden="true" className={clsx("h-4 w-4", iconClass)} />
        <span>{contact.phoneDisplay}</span>
      </a>
      <a href={`mailto:${contact.email}`} className={buttonClass}>
        <FaEnvelope aria-hidden="true" className={clsx("h-4 w-4", iconClass)} />
        <span>{contact.email}</span>
      </a>
    </div>
  );
}
