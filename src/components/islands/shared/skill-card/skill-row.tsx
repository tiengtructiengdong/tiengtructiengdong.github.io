/**
 * skill-card/skill-row.tsx
 *
 * A single skill row: monospace label + efficiency bar, with a desktop hover
 * tooltip for the skill's extra notes.
 */
import type { Skill } from "@lib/skills";
import { formatExperiencedSince } from "@lib/skills";
import clsx from "clsx";

export interface SkillRowProps {
  skill: Skill;
  isDesktop: boolean;
  yearsLabel: string;
  onClick: (skill: Skill) => void;
}

export default function SkillRow({
  skill,
  isDesktop,
  yearsLabel,
  onClick,
}: SkillRowProps): React.ReactElement {
  let tooltip: React.ReactNode = null;
  if (isDesktop && skill.extra_notes) {
    tooltip = (
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
    );
  }

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-mono text-xs text-[var(--color-fg)]">
          {skill.name}
        </span>
        <span className="font-mono text-[10px] text-[var(--color-fg-muted)]">
          {formatExperiencedSince(skill.experienced_since)} {yearsLabel}
        </span>
      </div>

      {/* Efficiency bar — hover (desktop) / tap (mobile) */}
      <div
        className="group relative cursor-pointer"
        onClick={() => onClick(skill)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick(skill);
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
        {tooltip}
      </div>
    </div>
  );
}
