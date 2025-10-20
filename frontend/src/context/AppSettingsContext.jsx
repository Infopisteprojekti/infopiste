import { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT_SECONDS = 60;

const getDefaultSettings = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    lang: urlParams.get('lang') || localStorage.getItem('lang') || 'fi',
    floor: urlParams.get('floor') || Number(localStorage.getItem('floor')) || 3,
    marker: urlParams.get('marker') || localStorage.getItem('marker') || null,
  };
};

const usePersistSettings = settings => {
  useEffect(() => {
    localStorage.setItem('lang', settings.lang);
    localStorage.setItem('floor', settings.floor);
    localStorage.setItem('marker', settings.marker);
  }, [settings.lang, settings.floor, settings.marker]);
};

const useInactivity = ({ restoreDefaults, timeout = 60, navigateTo }) => {
  const inactivityTimer = useRef(null);
  const navigate = useNavigate();

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      restoreDefaults();
      navigate(navigateTo);
    }, timeout * 1000);
  }, [restoreDefaults, timeout, navigateTo, navigate]);

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
  }, [resetInactivityTimer]);

  return resetInactivityTimer;
};

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {
  const defaultSettingsRef = useRef(getDefaultSettings());
  const [settings, setSettings] = useState(defaultSettingsRef.current);
  const [resetTrigger, setResetTrigger] = useState(0);

  const restoreDefaults = useCallback(() => {
    console.log('Restoring default settings due to inactivity');
    setSettings(defaultSettingsRef.current);
    setResetTrigger(prev => prev + 1);
  }, []);

  usePersistSettings(settings);
  useInactivity({
    restoreDefaults,
    timeout: INACTIVITY_TIMEOUT_SECONDS,
    navigateTo: '/',
  });

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
