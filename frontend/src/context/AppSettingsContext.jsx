import { createContext, useContext, useRef, useState } from 'react';

const AppSettingsContext = createContext(null);

const AppSettingsProvider = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaultSettings = {
    lang: urlParams.get('lang') || 'fi',
    floor: urlParams.get('floor') || 1,
  };

  // const defaultSettingsRef = useRef(defaultSettings);

  const [settings, setSettings] = useState(defaultSettings);

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
