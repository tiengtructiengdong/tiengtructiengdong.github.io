/**
 * work-history-card/timeline-entry.tsx
 *
 * A single timeline row: dot + line marker and a clickable company entry.
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import { formatDateRange } from "@lib/work-history";
import { CARD } from "@lib/classes";
import {
  TIMELINE_ITEM,
  TIMELINE_DOT,
  TIMELINE_LINE,
  TIMELINE_CONTENT,
  COMPANY_NAME,
} from "./classes";
import { PERIOD_TEXT } from "../classes";
import clsx from "clsx";

export interface TimelineEntryProps {
  entry: WorkHistoryEntry;
  onClick: (entry: WorkHistoryEntry) => void;
}

export default function TimelineEntry({
  entry,
  onClick,
}: TimelineEntryProps): React.ReactElement {
  let logo: React.ReactNode = null;
  if (entry.image_url) {
    logo = (
      <img
        src={entry.image_url}
        alt={`${entry.company_name} logo`}
        className="h-14 w-14 rounded-md object-cover"
      />
    );
  }

  return (
    <div className={TIMELINE_ITEM}>
      <div className="relative flex flex-col items-center">
        <div className={TIMELINE_DOT} />
        <div className={TIMELINE_LINE} />
      </div>
      <div
        className={clsx(TIMELINE_CONTENT, "flex flex-row")}
        onClick={() => onClick(entry)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick(entry);
          }
        }}
      >
        <div className="flex-1">
          <div className={clsx(COMPANY_NAME, "flex-1")}>
            {entry.company_name}
          </div>
          <div className={PERIOD_TEXT}>
            {formatDateRange(entry.date_from, entry.date_to)}
          </div>
        </div>
        {logo}
      </div>
    </div>
  );
}
