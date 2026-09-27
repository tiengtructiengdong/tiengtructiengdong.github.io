/**
 * mobile-navigation/mobile-nav-item-list.tsx
 *
 * The list of anchor links inside the mobile overlay menu. Maps each nav item
 * to a dedicated `MobileNavItem` element.
 */
import MobileNavItem from "./mobile-nav-item";

export interface MobileNavItemEntry {
  label: string;
  href: string;
}

export interface MobileNavItemListProps {
  items: readonly MobileNavItemEntry[];
  open: boolean;
  onClose: () => void;
}

export default function MobileNavItemList({
  items,
  open,
  onClose,
}: MobileNavItemListProps): React.ReactNode {
  return items.map((item) => (
    <MobileNavItem
      key={item.href}
      label={item.label}
      href={item.href}
      open={open}
      onClose={onClose}
    />
  ));
}
