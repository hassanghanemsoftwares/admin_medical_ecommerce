import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './messages/en.json';
import ar from './messages/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    debug: import.meta.env.PROD,
    detection: {
      // Use cookies only
      order: ['cookie'],
      caches: ['cookie'],
      lookupCookie: 'i18next', // Name of the cookie
      cookieMinutes: 10080, // 7 days
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
