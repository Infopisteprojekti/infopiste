import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLang from './locales/en.json';
import fiLang from './locales/fi.json';
import svLang from './locales/sv.json';

i18n
  .use(initReactI18next)

  .init({
    // debug: true,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translation: enLang,
      },
      fi: {
        translation: fiLang,
      },
      sv: {
        translation: svLang,
      },
    },
  });

export default i18n;
