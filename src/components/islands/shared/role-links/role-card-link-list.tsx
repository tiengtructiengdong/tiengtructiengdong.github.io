/**
 * role-links/role-card-link-list.tsx
 *
 * The "card" variant role navigation: larger buttons. Maps each role to a
 * dedicated `RoleCardLink` element.
 */
import type { IconType } from "react-icons";
import RoleCardLink from "./role-card-link";

export interface RoleCardLinkEntry {
  href: string;
  label: string;
  Icon: IconType;
}

export interface RoleCardLinkListProps {
  roles: RoleCardLinkEntry[];
}

export default function RoleCardLinkList({
  roles,
}: RoleCardLinkListProps): React.ReactNode {
  return roles.map(({ href, label, Icon }) => (
    <RoleCardLink key={href} href={href} label={label} Icon={Icon} />
  ));
}
