import { createContext, useState, useEffect } from 'react';

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);

  const defaultSettings = {
    lang: urlParams.get('lang') || localStorage.getItem('lang') || 'fi',
    floor: urlParams.get('floor') || localStorage.getItem('floor') || 3,
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

export default AppSettingsContext;
