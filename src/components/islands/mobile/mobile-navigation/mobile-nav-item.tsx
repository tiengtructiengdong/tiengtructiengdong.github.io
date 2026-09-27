/**
 * mobile-navigation/mobile-nav-item.tsx
 *
 * A single anchor link inside the mobile overlay menu.
 */
export interface MobileNavItemProps {
  label: string;
  href: string;
  open: boolean;
  onClose: () => void;
}

export default function MobileNavItem({
  label,
  href,
  open,
  onClose,
}: MobileNavItemProps): React.ReactElement {
  return (
    <a
      href={href}
      className="mobile-nav-overlay__link"
      onClick={onClose}
      tabIndex={open ? 0 : -1}
    >
      {label}
    </a>
  );
}
