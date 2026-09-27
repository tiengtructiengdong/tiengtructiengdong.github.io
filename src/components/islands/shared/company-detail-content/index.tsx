/**
 * company-detail-content/index.tsx
 * Shared content for a single work history entry.
 * Used in both the desktop modal and the mobile detail page.
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import { formatDateRange } from "@lib/work-history";
import { useTranslation } from "@lib/i18n";
import { ACCENT_HEADING } from "@lib/classes";
import { PERIOD_TEXT } from "../classes";
import clsx from "clsx";
import ProjectItemList from "./project-item-list";

export interface CompanyDetailContentProps {
  entry: WorkHistoryEntry;
}

export default function CompanyDetailContent({
  entry,
}: CompanyDetailContentProps) {
  const { t } = useTranslation();

  let companyLink: React.ReactNode = null;
  if (entry.url) {
    companyLink = (
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
    );
  }

  let coverImage: React.ReactNode = null;
  if (entry.image_url) {
    coverImage = (
      <img
        src={entry.image_url}
        alt={entry.company_name}
        className="aspect-[16/10] w-full rounded-lg object-cover"
        loading="lazy"
      />
    );
  }

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
      {companyLink}

      {/* Cover image */}
      {coverImage}

      {/* Projects */}
      <div className="flex flex-col gap-4">
        <h3 className={ACCENT_HEADING}>
          {t("company_history.projects")}
        </h3>
        <ProjectItemList projects={entry.projects} />
      </div>
    </div>
  );
}
