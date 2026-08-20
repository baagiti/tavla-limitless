import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/common.json';
import tr from '../locales/tr/common.json';
import ar from '../locales/ar/common.json';
import de from '../locales/de/common.json';
import es from '../locales/es/common.json';
import fr from '../locales/fr/common.json';
import hi from '../locales/hi/common.json';
import pl from '../locales/pl/common.json';
import ru from '../locales/ru/common.json';
import zh from '../locales/zh/common.json';

// Same 10 languages the Flutter app (lib/l10n/*.arb) shipped with, kept in
// that order for the language switcher.
export const SUPPORTED_LANGUAGES = ['en', 'tr', 'ar', 'de', 'es', 'fr', 'hi', 'pl', 'ru', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  tr: 'Türkçe',
  ar: 'العربية',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  pl: 'Polski',
  ru: 'Русский',
  zh: '中文',
};

// Languages that read right-to-left — used to flip document direction.
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

// Keeps <html dir/lang> in sync with the active language. Arabic needs the
// whole page mirrored, not just its own text.
function syncDocumentDirection(lng: string) {
  const lang = (lng.split('-')[0] as SupportedLanguage) || 'en';
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      tr: { common: tr },
      ar: { common: ar },
      de: { common: de },
      es: { common: es },
      fr: { common: fr },
      hi: { common: hi },
      pl: { common: pl },
      ru: { common: ru },
      zh: { common: zh },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })
  .then(() => {
    // .init()'s own language detection can resolve — and fire its first
    // 'languageChanged' — before the .on() listener below is attached, so
    // this catches the initial load; .on() covers every switch after that.
    syncDocumentDirection(i18n.resolvedLanguage || i18n.language || 'en');
  });

i18n.on('languageChanged', syncDocumentDirection);

export default i18n;
