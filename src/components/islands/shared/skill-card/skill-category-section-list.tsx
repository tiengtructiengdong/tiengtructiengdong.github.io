/**
 * skill-card/skill-category-section-list.tsx
 *
 * The row of skill category columns. Maps each category group to a dedicated
 * `SkillCategorySection` element.
 */
import type { Skill, SkillCategory } from "@lib/skills";
import SkillCategorySection from "./skill-category-section";

export interface SkillCategorySectionListProps {
  categories: SkillCategory[];
  isDesktop: boolean;
  yearsLabel: string;
  onBarClick: (skill: Skill) => void;
}

export default function SkillCategorySectionList({
  categories,
  isDesktop,
  yearsLabel,
  onBarClick,
}: SkillCategorySectionListProps): React.ReactNode {
  return categories.map((group) => (
    <SkillCategorySection
      key={group.category}
      group={group}
      isDesktop={isDesktop}
      yearsLabel={yearsLabel}
      onBarClick={onBarClick}
    />
  ));
}
