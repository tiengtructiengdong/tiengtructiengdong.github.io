/**
 * project-filter/filter-button.tsx
 *
 * A single category filter toggle button.
 */
import clsx from "clsx";

export interface FilterButtonProps {
  cat: string;
  isActive: boolean;
  onClick: (cat: string) => void;
}

export default function FilterButton({
  cat,
  isActive,
  onClick,
}: FilterButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className={clsx("project-filter__btn", isActive && "is-active")}
      onClick={() => onClick(cat)}
      aria-pressed={isActive}
    >
      {cat}
    </button>
  );
}
