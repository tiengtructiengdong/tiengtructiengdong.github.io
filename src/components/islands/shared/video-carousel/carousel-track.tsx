/**
 * video-carousel/carousel-track.tsx
 *
 * The horizontally-scrolling track of carousel slides. Maps each slide
 * descriptor to a dedicated `CarouselSlide` element.
 */
import CarouselSlide from "./carousel-slide";

export interface CarouselTrackSlide {
  id: string;
  title: string;
  isClone: boolean;
}

export interface CarouselTrackProps {
  slides: CarouselTrackSlide[];
  pos: number;
  slideWidth: number;
  accent: string;
}

export default function CarouselTrack({
  slides,
  pos,
  slideWidth,
  accent,
}: CarouselTrackProps): React.ReactNode {
  return slides.map((video, index) => (
    <CarouselSlide
      key={`${video.isClone ? "clone" : "real"}-${video.id}`}
      id={video.id}
      title={video.title}
      isClone={video.isClone}
      isActive={index === pos}
      slideWidth={slideWidth}
      accent={accent}
    />
  ));
}

