/**
 * video-carousel/clone-slide.tsx
 *
 * Lightweight thumbnail for a cloned carousel slide, so at most N live YouTube
 * players are mounted at once.
 */
import clsx from "clsx";
import { FaYoutube } from "react-icons/fa6";

export interface CloneSlideProps {
  id: string;
  accent: string;
}

export default function CloneSlide({
  id,
  accent,
}: CloneSlideProps): React.ReactElement {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`,
      }}
    >
      <div className="flex h-full w-full items-center justify-center bg-black/40">
        <FaYoutube aria-hidden="true" className={clsx("h-12 w-12", accent)} />
      </div>
    </div>
  );
}
