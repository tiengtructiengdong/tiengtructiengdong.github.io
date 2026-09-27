/**
 * role-links/role-card-link.tsx
 *
 * Larger role navigation anchor used in the "card" variant (landing / role
 * pages).
 */
import clsx from "clsx";
import type { IconType } from "react-icons";

export interface RoleCardLinkProps {
  href: string;
  label: string;
  Icon: IconType;
}

export default function RoleCardLink({
  href,
  label,
  Icon,
}: RoleCardLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg",
        "border border-white/10 bg-white/5 px-4 py-2",
        "font-mono text-base text-[var(--color-fg)]",
        "transition-colors hover:bg-white/10",
      )}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
