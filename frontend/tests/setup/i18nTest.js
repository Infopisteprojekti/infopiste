import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLang from '../../utils/i18n/locales/en.json';
import fiLang from '../../utils/i18n/locales/fi.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: enLang },
    fi: { translation: fiLang },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
