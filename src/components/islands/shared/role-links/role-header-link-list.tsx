/**
 * role-links/role-header-link-list.tsx
 *
 * The "header" variant role navigation: compact pills. Maps each role to a
 * dedicated `RoleHeaderLink` element.
 */
import type { IconType } from "react-icons";
import RoleHeaderLink from "./role-header-link";

export interface RoleHeaderLinkEntry {
  href: string;
  label: string;
  Icon: IconType;
}

export interface RoleHeaderLinkListProps {
  roles: RoleHeaderLinkEntry[];
}

export default function RoleHeaderLinkList({
  roles,
}: RoleHeaderLinkListProps): React.ReactNode {
  return roles.map(({ href, label, Icon }) => (
    <RoleHeaderLink key={href} href={href} label={label} Icon={Icon} />
  ));
}
