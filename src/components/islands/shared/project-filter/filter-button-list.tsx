/**
 * project-filter/filter-button-list.tsx
 *
 * The row of category filter toggle buttons. Maps each category to a
 * dedicated `FilterButton` element.
 */
import FilterButton from "./filter-button";

export interface FilterButtonListProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

export default function FilterButtonList({
  categories,
  active,
  onSelect,
}: FilterButtonListProps): React.ReactNode {
  return categories.map((cat) => (
    <FilterButton
      key={cat}
      cat={cat}
      isActive={cat === active}
      onClick={onSelect}
    />
  ));
}
