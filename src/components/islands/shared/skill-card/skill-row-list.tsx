/**
 * skill-card/skill-row-list.tsx
 *
 * The list of skill rows inside a single category column. Maps each skill to
 * a dedicated `SkillRow` element.
 */
import type { Skill } from "@lib/skills";
import SkillRow from "./skill-row";

export interface SkillRowListProps {
  skills: Skill[];
  isDesktop: boolean;
  yearsLabel: string;
  onClick: (skill: Skill) => void;
}

export default function SkillRowList({
  skills,
  isDesktop,
  yearsLabel,
  onClick,
}: SkillRowListProps): React.ReactNode {
  return skills.map((skill) => (
    <SkillRow
      key={skill.name}
      skill={skill}
      isDesktop={isDesktop}
      yearsLabel={yearsLabel}
      onClick={onClick}
    />
  ));
}
