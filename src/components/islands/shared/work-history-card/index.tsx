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
import { workHistory, formatDateRange } from "@lib/work-history";
import { readViewport } from "@lib/viewport";
import { useTranslation } from "@lib/i18n";
import { CARD, ACCENT_HEADING } from "@lib/classes";
import {
  TIMELINE_ITEM,
  TIMELINE_DOT,
  TIMELINE_LINE,
  TIMELINE_CONTENT,
  COMPANY_NAME,
} from "./classes";
import {
  PERIOD_TEXT,
  MODAL_OVERLAY,
  MODAL_WINDOW,
  MODAL_TITLE_BAR,
  TRAFFIC_LIGHT,
  MODAL_BODY,
} from "../classes";
import CompanyDetailContent from "../company-detail-content";
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
          {workHistory.map((entry) => (
            <div key={entry.slug} className={TIMELINE_ITEM}>
              <div className="relative flex flex-col items-center">
                <div className={TIMELINE_DOT} />
                <div className={TIMELINE_LINE} />
              </div>
              <div
                className={clsx(TIMELINE_CONTENT, "flex flex-row")}
                onClick={() => handleCompanyClick(entry)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCompanyClick(entry);
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
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt={`${entry.company_name} logo`}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && isDesktop && (
        <div
          className={MODAL_OVERLAY}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div className={MODAL_WINDOW} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_TITLE_BAR}>
              <span
                className={clsx(TRAFFIC_LIGHT, "bg-red-500 hover:bg-red-400")}
                onClick={closeModal}
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
                {selected.company_name}
              </span>
            </div>
            <div className={MODAL_BODY}>
              <CompanyDetailContent entry={selected} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
