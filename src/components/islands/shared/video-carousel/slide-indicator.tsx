/**
 * video-carousel/slide-indicator.tsx
 *
 * A single dot indicator button for the carousel.
 */
import clsx from "clsx";

export interface SlideIndicatorProps {
  label: string;
  isActive: boolean;
  accentBg: string;
  onClick: () => void;
}

export default function SlideIndicator({
  label,
  isActive,
  accentBg,
  onClick,
}: SlideIndicatorProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "true" : undefined}
      className={clsx(
        "h-2 rounded-full transition-all",
        isActive
          ? clsx("w-6", accentBg)
          : "w-2 bg-white/20 hover:bg-white/40",
      )}
    />
  );
}
