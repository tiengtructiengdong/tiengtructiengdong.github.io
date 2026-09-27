/**
 * language-selector/language-option-list.tsx
 *
 * The `<option>` elements for the language `<select>` (mobile variant). Maps
 * each locale to a dedicated `LanguageOption` element.
 */
import type { Locale } from "@lib/i18n";
import LanguageOption from "./language-option";

export interface LanguageOptionListEntry {
  value: Locale;
  label: string;
}

export interface LanguageOptionListProps {
  locales: LanguageOptionListEntry[];
}

export default function LanguageOptionList({
  locales,
}: LanguageOptionListProps): React.ReactNode {
  return locales.map(({ value, label }) => (
    <LanguageOption key={value} value={value} label={label} />
  ));
}
