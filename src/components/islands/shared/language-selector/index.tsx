/**
 * language-selector/index.tsx
 * A dropdown / button-group to switch the site language.
 *
 * Uses `atomWithStorage` from jotai/utils to persist the language choice to
 * localStorage. The atom is the source of truth; a `useEffect` syncs changes
 * to the i18next singleton so every `useTranslation()` consumer re-renders
 * reactively.
 *
 * Hydrated with client:load or client:idle.
 */

import { useAtom } from "jotai";
import { languageAtom } from "@stores/language";
import { useTranslation } from "@lib/i18n";
import type { Locale } from "@lib/i18n";
import clsx from "clsx";
import { useEffect } from "react";
import LanguageButtonList from "./language-button-list";
import LanguageOptionList from "./language-option-list";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ja", label: "JA" },
  { value: "ko", label: "KO" },
  { value: "vi", label: "VI" },
];

export interface LanguageSelectorProps {
  className?: string;
  /** When true, renders as a horizontal button group (desktop). */
  inline?: boolean;
}

export default function LanguageSelector({
  className = "",
  inline = false,
}: LanguageSelectorProps): React.ReactElement {
  const [locale, setLocale] = useAtom(languageAtom);
  const { i18n } = useTranslation();

  // Sync atom → i18next when the user picks a language.
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // Sync i18next → atom when the language changes from outside
  // (e.g. setGlobalLocale called from devtools or another component).
  useEffect(() => {
    const handler = (lng: string) => {
      setLocale(lng as Locale);
    };
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, [i18n, setLocale]);

  function handleChange(next: Locale): void {
    if (next === locale) {
      return;
    }
    setLocale(next);
  }

  if (inline) {
    return (
      <div
        className={clsx("lang-selector", className)}
        role="group"
        aria-label="Language"
      >
        <LanguageButtonList
          locales={LOCALES}
          locale={locale}
          onSelect={handleChange}
        />
      </div>
    );
  }

  return (
    <select
      className={clsx("lang-selector", className)}
      value={locale}
      onChange={(e) => handleChange(e.target.value as Locale)}
      aria-label="Language"
    >
      <LanguageOptionList locales={LOCALES} />
    </select>
  );
}
