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
import RoleCardLinkList from "./role-card-link-list";
import RoleHeaderLinkList from "./role-header-link-list";

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

  const roles = ROLES.map(({ href, labelKey, Icon }) => ({
    href,
    label: t(labelKey),
    Icon,
  }));

  if (variant === "card") {
    return (
      <nav
        className={clsx("flex flex-wrap justify-center gap-3", className)}
        aria-label="Roles"
      >
        <RoleCardLinkList roles={roles} />
      </nav>
    );
  }

  // header variant — compact icon + label pills
  return (
    <nav
      className={clsx("flex items-center gap-1", className)}
      aria-label="Roles"
    >
      <RoleHeaderLinkList roles={roles} />
    </nav>
  );
}
