/**
 * company-detail-content/tech-badge-list.tsx
 *
 * The row of tech-stack badges inside a project block. Maps each tech token
 * to a dedicated `TechBadge` element.
 */
import TechBadge from "./tech-badge";

export interface TechBadgeListProps {
  techStack: string[];
}

export default function TechBadgeList({
  techStack,
}: TechBadgeListProps): React.ReactNode {
  return techStack.map((tech) => <TechBadge key={tech} tech={tech} />);
}
