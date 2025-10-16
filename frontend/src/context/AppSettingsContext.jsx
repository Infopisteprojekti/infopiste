/* eslint-disable react-refresh/only-export-components */
// Fast refresh expects only react components but here we are
// exporting also a hook.

import { createContext, useContext, useState, useEffect } from 'react';

const AppSettingsContext = createContext(null);

const AppSettingsProvider = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);

  const defaultSettings = {
    lang: urlParams.get('lang') || localStorage.getItem('lang') || 'fi',
    floor: urlParams.get('floor') || localStorage.getItem('floor') || 1,
    marker: urlParams.get('marker') || localStorage.getItem('marker') || null,
  };

  // const defaultSettingsRef = useRef(defaultSettings);

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    localStorage.setItem('lang', settings.lang);
    localStorage.setItem('floor', settings.floor);
    localStorage.setItem('marker', settings.marker);
  }, [settings.lang, settings.floor, settings.marker]);

  useEffect(() => {
    console.log('App context current values:', settings);
  }, [settings]);

  // Inactivity code should probably be here.
  // Commented out defaultSettingsRef can be used to restore the original defaults.

  return (
    <AppSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('Context not initialized');
  }
  return context;
};

export { AppSettingsProvider, useAppSettings };
