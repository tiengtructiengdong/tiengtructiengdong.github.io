/**
 * video-carousel/slide-indicator-list.tsx
 *
 * The row of dot-indicators, one per real video. Maps each video to a
 * dedicated `SlideIndicator` element.
 */
import SlideIndicator from "./slide-indicator";

export interface SlideIndicatorVideo {
  id: string;
}

export interface SlideIndicatorListProps {
  videos: SlideIndicatorVideo[];
  realIndex: number;
  accentBg: string;
  goToLabel: (index: number) => string;
  onSelect: (index: number) => void;
}

export default function SlideIndicatorList({
  videos,
  realIndex,
  accentBg,
  goToLabel,
  onSelect,
}: SlideIndicatorListProps): React.ReactNode {
  return videos.map((video, index) => (
    <SlideIndicator
      key={video.id}
      label={goToLabel(index)}
      isActive={realIndex === index}
      accentBg={accentBg}
      onClick={() => onSelect(index)}
    />
  ));
}

