/**
 * role-links/role-header-link.tsx
 *
 * Compact role navigation pill used in the "header" variant.
 */
import clsx from "clsx";
import type { IconType } from "react-icons";

export interface RoleHeaderLinkProps {
  href: string;
  label: string;
  Icon: IconType;
}

export default function RoleHeaderLink({
  href,
  label,
  Icon,
}: RoleHeaderLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1",
        "font-mono text-xs text-[var(--color-fg-muted)]",
        "transition-colors hover:bg-white/5 hover:text-[var(--color-fg)]",
      )}
      aria-label={label}
    >
      <Icon aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
