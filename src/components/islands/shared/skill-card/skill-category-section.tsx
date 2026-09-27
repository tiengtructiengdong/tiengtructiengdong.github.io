/**
 * skill-card/skill-category-section.tsx
 *
 * A single skill category column (e.g. Frontend / Backend / AI).
 */
import type { Skill, SkillCategory } from "@lib/skills";
import { ACCENT_HEADING, CARD } from "@lib/classes";
import clsx from "clsx";
import SkillRowList from "./skill-row-list";

export interface SkillCategorySectionProps {
  group: SkillCategory;
  isDesktop: boolean;
  yearsLabel: string;
  onBarClick: (skill: Skill) => void;
}

export default function SkillCategorySection({
  group,
  isDesktop,
  yearsLabel,
  onBarClick,
}: SkillCategorySectionProps): React.ReactElement {
  return (
    <section
      className={clsx(
        "flex flex-col gap-3 flex-1",
        CARD,
        "overflow-visible",
      )}
    >
      <h3 className={clsx(ACCENT_HEADING, "text-[var(--color-fg-muted)]")}>
        {group.category}
      </h3>

      <div className="flex flex-col gap-3">
        <SkillRowList
          skills={group.skills}
          isDesktop={isDesktop}
          yearsLabel={yearsLabel}
          onClick={onBarClick}
        />
      </div>
    </section>
  );
}
