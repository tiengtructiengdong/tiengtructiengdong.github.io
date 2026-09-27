/**
 * company-detail-content/project-item-list.tsx
 *
 * The list of project blocks inside a company detail view. Maps each project
 * to a dedicated `ProjectItem` element.
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import ProjectItem from "./project-item";

type Project = WorkHistoryEntry["projects"][number];

export interface ProjectItemListProps {
  projects: Project[];
}

export default function ProjectItemList({
  projects,
}: ProjectItemListProps): React.ReactNode {
  return projects.map((project) => (
    <ProjectItem key={project.name} project={project} />
  ));
}
