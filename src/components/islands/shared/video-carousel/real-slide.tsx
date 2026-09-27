/**
 * video-carousel/real-slide.tsx
 *
 * A live YouTube iframe for a real (non-clone) carousel slide.
 */
export interface RealSlideProps {
  id: string;
  title: string;
}

export default function RealSlide({
  id,
  title,
}: RealSlideProps): React.ReactElement {
  return (
    <iframe
      className="absolute inset-0 h-full w-full"
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
