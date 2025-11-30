import { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '@/utils/i18n';

const AppSettingsContext = createContext(null);

const getDefaultSettings = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const markerParam = urlParams.get('marker');

  let marker = null;

  if (markerParam) {
    const [floor, x, y] = markerParam.split(',').map(Number);
    marker = { floor, x, y };
  }

  return {
    lang: urlParams.get('lang') ?? 'fi',
    floor: urlParams.get('floor') ? Number(urlParams.get('floor')) : 3,
    marker,
  };
};

export const AppSettingsProvider = ({
  children,
  inactivityTimeoutSeconds = 60,
  inactivityNavigateTo = '/',
}) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Boot settings - app changes to these when inactive
  const defaultSettings = useRef(getDefaultSettings());

  // Current settings that change in use
  const [settings, setSettings] = useState(defaultSettings.current);

  useEffect(() => {
    if (i18n.language !== settings.lang) {
      i18n.changeLanguage(settings.lang);
    }
  }, [settings.lang]);

  const restoreDefaults = useCallback(() => {
    // console.log('Restoring default settings due to inactivity');
    setSettings(defaultSettings.current);
    navigate(inactivityNavigateTo);
  }, [navigate, inactivityNavigateTo]);

  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      restoreDefaults,
      inactivityTimeoutSeconds * 1000
    );
  }, [restoreDefaults, inactivityTimeoutSeconds]);

  useEffect(() => {
    const events = ['mousedown', 'touchstart', 'keydown'];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
    };
  }, [resetInactivityTimer]);

  return (
    <AppSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsContext;
