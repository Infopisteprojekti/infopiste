import { createContext, useState, useRef, useEffect } from 'react';

const INACTIVITY_TIMEOUT_SECONDS = 3;

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);

  const defaultSettings = {
    lang: urlParams.get('lang') || localStorage.getItem('lang') || 'fi',
    floor: urlParams.get('floor') || localStorage.getItem('floor') || 3,
    marker: urlParams.get('marker') || localStorage.getItem('marker') || null,
  };

  const defaultSettingsRef = useRef(defaultSettings);
  const [settings, setSettings] = useState(defaultSettings);
  const [resetTrigger, setResetTrigger] = useState(0);
  const inactivityTimer = useRef(null);

  const restoreDefaults = () => {
    console.log('Restoring default settings due to inactivity');
    setSettings(defaultSettingsRef.current);
    setResetTrigger(prev => prev + 1);
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(
      restoreDefaults,
      INACTIVITY_TIMEOUT_SECONDS * 1000
    );
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
    ];
    events.forEach(event =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer.current);
      events.forEach(event =>
        window.removeEventListener(event, resetInactivityTimer)
      );
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', settings.lang);
    localStorage.setItem('floor', settings.floor);
    localStorage.setItem('marker', settings.marker);
  }, [settings.lang, settings.floor, settings.marker]);

  useEffect(() => {
    console.log('App context current values:', settings);
  }, [settings]);

  return (
    <AppSettingsContext.Provider
      value={{ settings, setSettings, resetTrigger }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsContext;
