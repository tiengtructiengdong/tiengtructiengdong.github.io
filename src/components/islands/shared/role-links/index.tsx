/**
 * role-links/index.tsx
 *
 * Three role navigation buttons — Developer, Video Editor, Music Artist —
 * each rendered with a suitable icon from `react-icons`. Reused in two
 * contexts:
 *  - `variant="header"`: compact pill buttons in the site header.
 *  - `variant="card"`:   larger buttons on the landing / role pages.
 *
 * The labels are read from the i18next instance so they update
 * instantly when the user switches locale.
 *
 * Hydrated client-side (client:load or client:visible).
 */

import clsx from "clsx";
import { FaLaptopCode, FaFilm, FaMusic } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { useTranslation } from "@lib/i18n";

interface RoleLink {
  href: string;
  labelKey: string;
  Icon: IconType;
}

const ROLES: RoleLink[] = [
  { href: "/dev", labelKey: "landing.developer", Icon: FaLaptopCode },
  { href: "/video-editor", labelKey: "landing.video_editor", Icon: FaFilm },
  { href: "/music", labelKey: "landing.music_artist", Icon: FaMusic },
];

export interface RoleLinksProps {
  className?: string;
  /** Render style: compact header pills or larger card buttons. */
  variant?: "header" | "card";
}

export default function RoleLinks({
  className = "",
  variant = "header",
}: RoleLinksProps): React.ReactElement {
  const { t } = useTranslation();

  if (variant === "card") {
    return (
      <nav
        className={clsx("flex flex-wrap justify-center gap-3", className)}
        aria-label="Roles"
      >
        {ROLES.map(({ href, labelKey, Icon }) => (
          <a
            key={href}
            href={href}
            className={clsx(
              "inline-flex items-center gap-2 rounded-lg",
              "border border-white/10 bg-white/5 px-4 py-2",
              "font-mono text-base text-[var(--color-fg)]",
              "transition-colors hover:bg-white/10",
            )}
          >
            <Icon aria-hidden="true" />
            <span>{t(labelKey)}</span>
          </a>
        ))}
      </nav>
    );
  }

  // header variant — compact icon + label pills
  return (
    <nav
      className={clsx("flex items-center gap-1", className)}
      aria-label="Roles"
    >
      {ROLES.map(({ href, labelKey, Icon }) => (
        <a
          key={href}
          href={href}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1",
            "font-mono text-xs text-[var(--color-fg-muted)]",
            "transition-colors hover:bg-white/5 hover:text-[var(--color-fg)]",
          )}
          aria-label={t(labelKey)}
        >
          <Icon aria-hidden="true" />
          <span className="hidden sm:inline">
            {t(labelKey)}
          </span>
        </a>
      ))}
    </nav>
  );
}
