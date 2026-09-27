/**
 * company-detail-content/tech-badge.tsx
 *
 * A single tech-stack pill badge for a project.
 */
import { TECH_BADGE } from "./classes";

export interface TechBadgeProps {
  tech: string;
}

export default function TechBadge({
  tech,
}: TechBadgeProps): React.ReactElement {
  return <span className={TECH_BADGE}>{tech}</span>;
}
