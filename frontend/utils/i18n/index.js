import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LANGUAGE_OPTIONS from '../../src/constants/languageOptions';

import enLang from './locales/en.json';
import fiLang from './locales/fi.json';
import svLang from './locales/sv.json';

const DEFAULT_LANG = 'fi';
const supportedLangs = LANGUAGE_OPTIONS.map(opt => opt.value);

const urlParams = new URLSearchParams(window.location.search);
const langQuery = urlParams.get('lang');

const initialLang = supportedLangs.includes(langQuery)
  ? langQuery
  : localStorage.getItem('lang') || DEFAULT_LANG;

i18n
  .use(initReactI18next)

  .init({
    lng: initialLang,
    fallbackLng: DEFAULT_LANG,

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
