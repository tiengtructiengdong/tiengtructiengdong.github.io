/**
 * language-selector/language-button.tsx
 *
 * A single inline language toggle button (desktop variant).
 */
import clsx from "clsx";
import type { Locale } from "@lib/i18n";

export interface LanguageButtonProps {
  value: Locale;
  label: string;
  isActive: boolean;
  onClick: (value: Locale) => void;
}

export default function LanguageButton({
  value,
  label,
  isActive,
  onClick,
}: LanguageButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className={clsx(
        "lang-selector__btn",
        isActive && "lang-selector__btn--active",
      )}
      onClick={() => onClick(value)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
