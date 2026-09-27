/**
 * work-history-card/index.tsx
 * Timeline list of work history entries.
 *
 * - Desktop: clicking a company opens a Mac-style modal popup.
 *   URL is pushed to /company/{slug} via History API (no page load).
 *   Closing the modal pops back to home.
 * - Mobile: clicking navigates to /company/{slug} (real page).
 */
import { useState, useEffect, useCallback } from "react";
import type { WorkHistoryEntry } from "@lib/work-history";
import { workHistory } from "@lib/work-history";
import { readViewport } from "@lib/viewport";
import { useTranslation } from "@lib/i18n";
import { CARD, ACCENT_HEADING } from "@lib/classes";
import CompanyDetailModal from "./company-detail-modal";
import TimelineEntryList from "./timeline-entry-list";
import clsx from "clsx";

export default function WorkHistoryCard() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<WorkHistoryEntry | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(readViewport().isDesktop);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }
    const onPop = () => setSelected(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selected]);

  const handleCompanyClick = useCallback(
    (entry: WorkHistoryEntry) => {
      if (isDesktop) {
        window.history.pushState(
          { company: entry.slug },
          "",
          `/dev/company/${entry.slug}`,
        );
        setSelected(entry);
      } else {
        window.location.href = `/dev/company/${entry.slug}`;
      }
    },
    [isDesktop],
  );

  const closeModal = useCallback(() => {
    setSelected(null);
    window.history.back();
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, closeModal]);

  return (
    <>
      <div className={CARD}>
        <h2 className={clsx(ACCENT_HEADING, "mb-4")}>
          {t("company_history.title")}
        </h2>
        <div className="flex flex-col">
          <TimelineEntryList
            entries={workHistory}
            onClick={handleCompanyClick}
          />
        </div>
      </div>

      <CompanyDetailModal
        entry={selected}
        isDesktop={isDesktop}
        onClose={closeModal}
      />
    </>
  );
}
