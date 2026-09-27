/**
 * profile-avatar/index.tsx
 *
 * Profile picture rendered at the top of the landing / role pages.
 * Uses a `react-icons` user icon inside a circular, gradient-ringed
 * avatar so the image source stays purely within the icon library.
 *
 * The ring gradient matches the page's dot-matrix gradient preset.
 * Hydrated client-side (client:load or client:visible).
 */

import type { GradientPreset } from "@components/islands/shared/dot-matrix-background";
import clsx from "clsx";

/** Tailwind gradient classes for each preset's avatar ring + icon tint. */
const RING_CLASSES: Record<GradientPreset, string> = {
  "cyan-blue": "bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500",
  "yellow-orange":
    "bg-gradient-to-br from-yellow-300 via-orange-500 to-red-500",
  "red-pink": "bg-gradient-to-br from-red-500 via-rose-500 to-pink-500",
};

export interface ProfileAvatarProps {
  className?: string;
  /** Gradient preset — should match the page's dot-matrix gradient. */
  gradient?: GradientPreset;
}

export default function ProfileAvatar({
  className = "",
  gradient = "cyan-blue",
}: ProfileAvatarProps): React.ReactElement {
  return (
    <div
      className={clsx(
        "mx-auto flex h-50 w-50 items-center justify-center rounded-full p-1",
        RING_CLASSES[gradient],
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d0d18] select-none">
        <img
          src="/images/avatar.jpg"
          alt="Profile Avatar"
          className="h-45 w-45 rounded-full select-none"
        />
      </div>
    </div>
  );
}
