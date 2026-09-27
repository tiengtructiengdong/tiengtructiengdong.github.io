/**
 * company-detail-content/index.tsx
 * Shared content for a single work history entry.
 * Used in both the desktop modal and the mobile detail page.
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import { formatDateRange } from "@lib/work-history";
import { useTranslation } from "@lib/i18n";
import { ACCENT_HEADING, BODY } from "@lib/classes";
import { PERIOD_TEXT } from "../classes";
import { PROJECT_CARD, TECH_BADGE } from "./classes";
import clsx from "clsx";

export interface CompanyDetailContentProps {
  entry: WorkHistoryEntry;
}

export default function CompanyDetailContent({
  entry,
}: CompanyDetailContentProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      {/* Header: company name + period */}
      <div
        className={clsx(
          "flex flex-wrap items-baseline justify-between",
          "gap-2",
        )}
      >
        <h2 className={clsx(ACCENT_HEADING, "text-lg font-semibold")}>
          {entry.company_name}
        </h2>
        <span className={PERIOD_TEXT}>
          {formatDateRange(entry.date_from, entry.date_to)}
        </span>
      </div>

      {/* Company link */}
      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "font-mono text-xs text-cyan-400",
            "transition-colors hover:text-cyan-300",
          )}
        >
          {entry.url} ↗
        </a>
      )}

      {/* Cover image */}
      {entry.image_url && (
        <img
          src={entry.image_url}
          alt={entry.company_name}
          className="aspect-[16/10] w-full rounded-lg object-cover"
          loading="lazy"
        />
      )}

      {/* Projects */}
      <div className="flex flex-col gap-4">
        <h3 className={ACCENT_HEADING}>
          {t("company_history.projects")}
        </h3>
        {entry.projects.map((project) => (
          <div key={project.name} className={PROJECT_CARD}>
            <div
              className={clsx(
                "mb-2 flex flex-wrap items-baseline justify-between",
                "gap-2",
              )}
            >
              <h4
                className={clsx(
                  "font-mono text-base font-medium",
                  "text-[var(--color-fg)]",
                )}
              >
                {project.name}
              </h4>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "font-mono text-xs text-cyan-400",
                    "transition-colors hover:text-cyan-300",
                  )}
                >
                  {t("company_history.link")} ↗
                </a>
              )}
            </div>
            <p className={clsx(BODY, "mb-3")}>{project.problem_solved}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech) => (
                <span key={tech} className={TECH_BADGE}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
