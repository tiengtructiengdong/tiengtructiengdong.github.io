/**
 * language-selector/language-option.tsx
 *
 * A single `<option>` for the language `<select>` (mobile variant).
 */
import type { Locale } from "@lib/i18n";

export interface LanguageOptionProps {
  value: Locale;
  label: string;
}

export default function LanguageOption({
  value,
  label,
}: LanguageOptionProps): React.ReactElement {
  return <option value={value}>{label}</option>;
}
