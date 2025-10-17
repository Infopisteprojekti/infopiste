import { beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLang from '../utils/i18n/locales/en.json';
import fiLang from '../utils/i18n/locales/fi.json';

// Tests fetch by text so we need to load the actual text before
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: enLang },
    fi: { translation: fiLang },
  },
  interpolation: { escapeValue: false },
});

beforeEach(() => {
  i18n.changeLanguage('en');
})

afterEach(() => {
  cleanup();
});

export default i18n;
