/**
 * video-carousel/carousel-slide.tsx
 *
 * A single carousel slide. Real slides render a live YouTube iframe; clones
 * render a lightweight thumbnail so at most N live players are mounted.
 */
import CloneSlide from "./clone-slide";
import RealSlide from "./real-slide";

// Dimmed opacity for non-active tiles peeking on either side.
const DIM_OPACITY = 0.5;

export interface CarouselSlideProps {
  id: string;
  title: string;
  isClone: boolean;
  isActive: boolean;
  slideWidth: number;
  accent: string;
}

export default function CarouselSlide({
  id,
  title,
  isClone,
  isActive,
  slideWidth,
  accent,
}: CarouselSlideProps): React.ReactElement {
  let inner: React.ReactElement;
  if (isClone) {
    inner = <CloneSlide id={id} accent={accent} />;
  } else {
    inner = <RealSlide id={id} title={title} />;
  }

  return (
    <div
      className="shrink-0 transition-opacity duration-300"
      style={{
        width: slideWidth ? `${slideWidth}px` : "100%",
        opacity: isActive ? 1 : DIM_OPACITY,
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {inner}
      </div>
    </div>
  );
}
