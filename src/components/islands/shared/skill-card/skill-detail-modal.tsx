/**
 * skill-card/skill-detail-modal.tsx
 *
 * Mac-style popup shown on mobile when a skill bar is tapped, displaying the
 * skill's extra notes. Returns null on desktop (desktop uses hover tooltips).
 */
import type { Skill } from "@lib/skills";
import { formatExperiencedSince } from "@lib/skills";
import {
  MODAL_BODY,
  MODAL_OVERLAY,
  MODAL_TITLE_BAR,
  MODAL_WINDOW,
  TRAFFIC_LIGHT,
} from "../classes";
import clsx from "clsx";

export interface SkillDetailModalProps {
  skill: Skill | null;
  isDesktop: boolean;
  yearsLabel: string;
  onClose: () => void;
}

export default function SkillDetailModal({
  skill,
  isDesktop,
  yearsLabel,
  onClose,
}: SkillDetailModalProps): React.ReactElement | null {
  if (!skill || isDesktop) {
    return null;
  }

  return (
    <div
      className={MODAL_OVERLAY}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={MODAL_WINDOW} onClick={(e) => e.stopPropagation()}>
        <div className={MODAL_TITLE_BAR}>
          <span
            className={clsx(TRAFFIC_LIGHT, "bg-red-500 hover:bg-red-400")}
            onClick={onClose}
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
            {skill.name}
          </span>
        </div>
        <div className={MODAL_BODY}>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <span className="font-mono text-base text-[var(--color-fg)]">
              {skill.name}
            </span>
            <span className="font-mono text-xs text-[var(--color-fg-muted)]">
              {formatExperiencedSince(skill.experienced_since)} {yearsLabel}
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
                width: `${Math.min(1, Math.max(0, skill.efficiency)) * 100}%`,
                backgroundColor: skill.color,
              }}
            />
          </div>
          <p
            className={clsx(
              "font-mono text-xs leading-relaxed",
              "text-[var(--color-fg-muted)]",
            )}
          >
            {skill.extra_notes}
          </p>
        </div>
      </div>
    </div>
  );
}
