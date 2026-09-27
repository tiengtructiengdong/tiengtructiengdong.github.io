/**
 * language-selector/language-button-list.tsx
 *
 * The inline button group of language toggles (desktop variant). Maps each
 * locale to a dedicated `LanguageButton` element.
 */
import type { Locale } from "@lib/i18n";
import LanguageButton from "./language-button";

export interface LanguageButtonListEntry {
  value: Locale;
  label: string;
}

export interface LanguageButtonListProps {
  locales: LanguageButtonListEntry[];
  locale: Locale;
  onSelect: (value: Locale) => void;
}

export default function LanguageButtonList({
  locales,
  locale,
  onSelect,
}: LanguageButtonListProps): React.ReactNode {
  return locales.map(({ value, label }) => (
    <LanguageButton
      key={value}
      value={value}
      label={label}
      isActive={value === locale}
      onClick={onSelect}
    />
  ));
}
