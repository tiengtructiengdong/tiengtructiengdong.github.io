/**
 * project-filter/index.tsx
 * Cross-device interactive UI island. Filters the server-rendered
 * project grid/list by toggling visibility of [data-category]
 * items. Mounted on both desktop and mobile layouts.
 */
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

export interface ProjectFilterProps {
  /** Selector for the list/grid container rendered by Astro. */
  containerSelector?: string;
  /** Item selector inside the container. */
  itemSelector?: string;
}

const DEFAULT_FILTER = "All";

export default function ProjectFilter({
  containerSelector = "[data-project-grid]",
  itemSelector = "[data-category]",
}: ProjectFilterProps): React.ReactElement {
  const [categories, setCategories] = useState<string[]>([DEFAULT_FILTER]);
  const [active, setActive] = useState<string>(DEFAULT_FILTER);

  // Collect categories from the server-rendered DOM.
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      return;
    }
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(itemSelector),
    );
    const found = new Set<string>([DEFAULT_FILTER]);
    for (const el of items) {
      const cat = el.dataset.category;
      if (cat) {
        found.add(cat);
      }
    }
    setCategories(Array.from(found));
  }, [containerSelector, itemSelector]);

  // Apply filter to the DOM.
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      return;
    }
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(itemSelector),
    );
    for (const el of items) {
      const cat = el.dataset.category ?? "";
      const visible = active === DEFAULT_FILTER || cat === active;
      el.style.display = visible ? "" : "none";
    }
  }, [active, containerSelector, itemSelector]);

  const buttons = useMemo(
    () =>
      categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={clsx("project-filter__btn", cat === active && "is-active")}
          onClick={(): void => setActive(cat)}
          aria-pressed={cat === active}
        >
          {cat}
        </button>
      )),
    [categories, active],
  );

  return <div className="project-filter">{buttons}</div>;
}
