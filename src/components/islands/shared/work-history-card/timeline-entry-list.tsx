/**
 * work-history-card/timeline-entry-list.tsx
 *
 * The list of timeline rows. Maps each work history entry to a dedicated
 * `TimelineEntry` element.
 */
import type { WorkHistoryEntry } from "@lib/work-history";
import TimelineEntry from "./timeline-entry";

export interface TimelineEntryListProps {
  entries: WorkHistoryEntry[];
  onClick: (entry: WorkHistoryEntry) => void;
}

export default function TimelineEntryList({
  entries,
  onClick,
}: TimelineEntryListProps): React.ReactNode {
  return entries.map((entry) => (
    <TimelineEntry key={entry.slug} entry={entry} onClick={onClick} />
  ));
}
