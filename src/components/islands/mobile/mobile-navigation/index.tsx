/**
 * mobile-navigation/index.tsx
 * Touch-optimized overlay menu. Toggled by the [data-nav-toggle]
 * button rendered statically in mobile-header.astro.
 *
 * Hydrated with client:load so it works without JS-dependent markup.
 */
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Work", href: "/dev#work" },
  { label: "About", href: "/dev#about" },
  { label: "Contact", href: "/dev#contact" },
] as const;

export interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({
  className,
}: MobileNavigationProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const toggle = useCallback((): void => setOpen((o) => !o), []);
  const close = useCallback((): void => setOpen(false), []);

  useEffect(() => {
    const buttons =
      document.querySelectorAll<HTMLButtonElement>("[data-nav-toggle]");
    const handlers: Array<() => void> = [];
    for (const btn of buttons) {
      const handler = (): void => {
        toggle();
        btn.setAttribute("aria-expanded", String(open));
      };
      btn.addEventListener("click", handler);
      handlers.push(() => btn.removeEventListener("click", handler));
    }
    return (): void => {
      for (const fn of handlers) {
        fn();
      }
    };
  }, [toggle, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return (): void => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      id="mobile-nav"
      className={clsx("mobile-nav-overlay", className)}
      data-open={open}
      aria-hidden={!open}
    >
      {NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="mobile-nav-overlay__link"
          onClick={close}
          tabIndex={open ? 0 : -1}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
