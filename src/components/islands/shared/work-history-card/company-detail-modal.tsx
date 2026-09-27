/**
 * work-history-card/company-detail-modal.tsx
 *
 * Mac-style desktop modal showing the full company detail content for a
 * selected work history entry. Returns null on mobile or when nothing is
 * selected (mobile navigates to a real page instead).
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import {
  MODAL_BODY,
  MODAL_OVERLAY,
  MODAL_TITLE_BAR,
  MODAL_WINDOW,
  TRAFFIC_LIGHT,
} from "../classes";
import CompanyDetailContent from "../company-detail-content";
import clsx from "clsx";

export interface CompanyDetailModalProps {
  entry: WorkHistoryEntry | null;
  isDesktop: boolean;
  onClose: () => void;
}

export default function CompanyDetailModal({
  entry,
  isDesktop,
  onClose,
}: CompanyDetailModalProps): React.ReactElement | null {
  if (!entry || !isDesktop) {
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
            {entry.company_name}
          </span>
        </div>
        <div className={MODAL_BODY}>
          <CompanyDetailContent entry={entry} />
        </div>
      </div>
    </div>
  );
}
