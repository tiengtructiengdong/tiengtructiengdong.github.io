/**
 * skill-card/index.tsx
 * Skills card grouped by category (Frontend, Backend, AI).
 *
 * Each skill renders a monospace label + an efficiency bar (0–1).
 *  - Desktop: hovering a bar reveals the skill's extra notes.
 *  - Mobile:  tapping a bar opens a Mac-style popup with the extra notes.
 *
 * Hydrated client-side (client:load or client:visible).
 */

import { CARD } from "@lib/classes";
import { useTranslation } from "@lib/i18n";
import type { Skill, SkillCategory } from "@lib/skills";
import { skillCategories } from "@lib/skills";
import { readViewport } from "@lib/viewport";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import SkillCategorySectionList from "./skill-category-section-list";
import SkillDetailModal from "./skill-detail-modal";

export default function SkillCard({
  className = "",
  categories = skillCategories,
  accentClassName,
}: {
  className?: string;
  categories?: SkillCategory[];
  accentClassName?: string;
}): React.ReactElement {
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const titleClass = clsx(
    "font-mono text-base font-medium mb-4",
    accentClassName ?? "text-cyan-400",
  );

  useEffect(() => {
    const update = () => setIsDesktop(readViewport().isDesktop);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const closePopup = useCallback(() => setActiveSkill(null), []);

  useEffect(() => {
    if (!activeSkill) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSkill, closePopup]);

  const handleBarClick = useCallback(
    (skill: Skill) => {
      // Desktop reveals notes on hover; only mobile opens the popup.
      if (!isDesktop) {
        setActiveSkill(skill);
      }
    },
    [isDesktop],
  );

  return (
    <>
      <div
        className={clsx(CARD, "overflow-visible h-full select-none", className)}
      >
        <h2 className={titleClass}>{t("skills.title")}</h2>

        <div className="flex flex-row gap-6">
          <SkillCategorySectionList
            categories={categories}
            isDesktop={isDesktop}
            yearsLabel={t("skills.years")}
            onBarClick={handleBarClick}
          />
        </div>
      </div>

      <SkillDetailModal
        skill={activeSkill}
        isDesktop={isDesktop}
        yearsLabel={t("skills.years")}
        onClose={closePopup}
      />
    </>
  );
}
