import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLang from './locales/en.json';
import fiLang from './locales/fi.json';
import svLang from './locales/sv.json';

const DEFAULT_LANG = 'fi';

const isTest = import.meta.env.MODE === 'test';

const initialLang =
  new URLSearchParams(window.location.search).get('lang') ||
  localStorage.getItem('lang') ||
  DEFAULT_LANG;

i18n
  .use(initReactI18next)

  .init({
    lng: isTest ? 'en' : initialLang,
    fallbackLng: DEFAULT_LANG,

    interpolation: { escapeValue: false },
    react: { useSuspense: true },
    initAsync: false,

    resources: {
      en: { translation: enLang },
      fi: { translation: fiLang },
      sv: { translation: svLang },
    },
  });

export default i18n;
