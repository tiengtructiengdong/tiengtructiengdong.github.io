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

import { ACCENT_HEADING, CARD } from "@lib/classes";
import { useTranslation } from "@lib/i18n";
import type { Skill, SkillCategory } from "@lib/skills";
import { formatExperiencedSince, skillCategories } from "@lib/skills";
import { readViewport } from "@lib/viewport";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import {
  MODAL_BODY,
  MODAL_OVERLAY,
  MODAL_TITLE_BAR,
  MODAL_WINDOW,
  TRAFFIC_LIGHT,
} from "../classes";

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
          {categories.map((group) => (
            <section
              key={group.category}
              className={clsx(
                "flex flex-col gap-3 flex-1",
                CARD,
                "overflow-visible",
              )}
            >
              <h3
                className={clsx(ACCENT_HEADING, "text-[var(--color-fg-muted)]")}
              >
                {group.category}
              </h3>

              <div className="flex flex-col gap-3">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="font-mono text-xs text-[var(--color-fg)]">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--color-fg-muted)]">
                        {formatExperiencedSince(skill.experienced_since)}{" "}
                        {t("skills.years")}
                      </span>
                    </div>

                    {/* Efficiency bar — hover (desktop) / tap (mobile) */}
                    <div
                      className="group relative cursor-pointer"
                      onClick={() => handleBarClick(skill)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBarClick(skill);
                        }
                      }}
                    >
                      <div className="h-3 w-full overflow-visible bg-white/10">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${Math.min(1, Math.max(0, skill.efficiency)) * 100}%`,
                            backgroundColor: skill.color,
                          }}
                        />
                      </div>

                      {/* Desktop hover tooltip — upper-right corner */}
                      {isDesktop && skill.extra_notes && (
                        <div
                          className={clsx(
                            "pointer-events-none absolute right-0 bottom-full",
                            "z-20 mb-2 hidden max-w-xs rounded-md border",
                            "border-white/10 bg-[#0d0d18]/95 p-2",
                            "font-mono text-[11px] leading-relaxed",
                            "text-[var(--color-fg)] shadow-lg backdrop-blur-sm",
                            "group-hover:block",
                          )}
                        >
                          {skill.extra_notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile popup (Mac-style) */}
      {activeSkill && !isDesktop && (
        <div
          className={MODAL_OVERLAY}
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
        >
          <div className={MODAL_WINDOW} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_TITLE_BAR}>
              <span
                className={clsx(TRAFFIC_LIGHT, "bg-red-500 hover:bg-red-400")}
                onClick={closePopup}
                aria-label="Close"
              />
              <span className={clsx(TRAFFIC_LIGHT, "bg-yellow-500")} />
              <span className={clsx(TRAFFIC_LIGHT, "bg-green-500")} />
              <span
                className={clsx(
                  "ml-2 font-mono text-xs",
                  "text-[var(--color-fg-muted)]",
                )}
              >
                {activeSkill.name}
              </span>
            </div>
            <div className={MODAL_BODY}>
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-base text-[var(--color-fg)]">
                  {activeSkill.name}
                </span>
                <span className="font-mono text-xs text-[var(--color-fg-muted)]">
                  {formatExperiencedSince(activeSkill.experienced_since)}{" "}
                  {t("skills.years")}
                </span>
              </div>
              <div
                className={clsx(
                  "mb-4 h-2 w-full overflow-hidden",
                  "rounded-full bg-white/10",
                )}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(1, Math.max(0, activeSkill.efficiency)) * 100}%`,
                    backgroundColor: activeSkill.color,
                  }}
                />
              </div>
              <p
                className={clsx(
                  "font-mono text-xs leading-relaxed",
                  "text-[var(--color-fg-muted)]",
                )}
              >
                {activeSkill.extra_notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
