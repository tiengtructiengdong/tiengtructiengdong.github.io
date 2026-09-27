import { atomWithStorage } from "jotai/utils";
import type { Locale } from "@lib/i18n";

/** Persisted language preference. Syncs to i18next via `language-selector`. */
export const languageAtom = atomWithStorage<Locale>("portfolio-lang", "en");
