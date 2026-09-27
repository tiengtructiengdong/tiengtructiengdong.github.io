/**
 * i18n.ts
 * i18next-based internationalization for the portfolio site.
 *
 * Follows the "mini" repo pattern: a single i18next instance is the source of
 * truth for the active language, react-i18next makes islands reactive, and
 * `setGlobalLocale()` switches the language globally (persisted to localStorage
 * and reflected by every `useTranslation()` consumer).
 *
 * Adapted for Astro SSR: locale resources are bundled STATICALLY rather than
 * loaded lazily via `resourcesToBackend`. The lazy backend is asynchronous, so
 * on the client it would race the first render (raw keys flashing) and on the
 * server it would break the synchronous `useTranslations(locale)` calls in
 * `.astro` files. Static resources make translation resolve synchronously
 * everywhere.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import vi from "../locales/vi.json";

export type Locale = "en" | "ja" | "ko" | "vi";

const STORAGE_KEY = "portfolio-lang";
const SUPPORTED: readonly Locale[] = ["en", "ja", "ko", "vi"];

function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED as readonly string[]).includes(value);
}

/** Read the persisted locale (client) or default to "en" (server). */
function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
  return "en";
}

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
  vi: { translation: vi },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLocale(),
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED],
    interpolation: { escapeValue: false },
    // Avoid React Suspense during SSR / lazy resource loading; resources are
    // static so `ready` is true immediately.
    react: { useSuspense: false },
  });

  // Persist language changes so the preference survives reloads.
  i18n.on("languageChanged", (lng: string) => {
    if (typeof window === "undefined" || !isLocale(lng)) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
  });
}

export default i18n;

// Re-export the reactive hook so importing it from "@lib/i18n" also guarantees
// the i18next instance is initialized in that client chunk.
export { useTranslation } from "react-i18next";

/**
 * Switch the active language globally. Persists the choice to localStorage
 * and re-renders every `useTranslation()` consumer.
 */
export function setGlobalLocale(locale: Locale): void {
  i18n.changeLanguage(locale);
}

/**
 * Synchronous translation bound to an explicit locale.
 *
 * SSR-safe: used by `.astro` files where the locale comes from the URL/props
 * (not from the i18next singleton). Reactive client islands should prefer
 * `useTranslation()` instead.
 *
 * Returns a bound `t` function so call sites read `t("key")` instead of
 * repeating the locale on every call.
 */
export function useTranslations(locale: Locale) {
  return i18n.getFixedT(locale);
}

/** Detect locale from Astro's URL (server-side). */
export function localeFromUrl(url: URL): Locale {
  const lang = url.searchParams.get("lang");
  if (isLocale(lang)) {
    return lang;
  }
  return "en";
}

/** Get the <html lang=""> attribute value for a locale. */
export function langAttr(locale: Locale): string {
  return locale;
}
