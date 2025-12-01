import {
  createContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '@/utils/i18n';

const INACTIVITY_TIMEOUT_SECONDS = 60;

const isTest = import.meta.env.MODE === 'test';

const getDefaultSettings = (search, storage = localStorage) => {
  const urlParams = new URLSearchParams(search ?? '');

  const lang = urlParams.get('lang') ?? storage.getItem('lang') ?? 'fi';
  const floorParam = urlParams.get('floor') ?? storage.getItem('floor');
  const floor =
    floorParam !== null && floorParam !== '' ? Number(floorParam) : 3;
  const marker = urlParams.get('marker') ?? storage.getItem('marker') ?? null;

  return { lang, floor, marker };
};

const usePersistSettings = settings => {
  useEffect(() => {
    localStorage.setItem('lang', settings.lang);
    localStorage.setItem('floor', String(settings.floor));
    if (settings.marker === null) localStorage.removeItem('marker');
    else localStorage.setItem('marker', settings.marker);
  }, [settings.lang, settings.floor, settings.marker]);
};

const useInactivity = ({
  restoreDefaults,
  timeout = 60,
  navigateTo,
  enabled = true,
}) => {
  const inactivityTimer = useRef(null);
  const navigate = useNavigate();

  const resetInactivityTimer = useCallback(() => {
    if (!enabled) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      restoreDefaults();
      if (navigateTo) navigate(navigateTo);
    }, timeout * 1000);
  }, [enabled, restoreDefaults, timeout, navigateTo, navigate]);

  useEffect(() => {
    if (!enabled) return;

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
  }, [enabled, resetInactivityTimer]);

  return resetInactivityTimer;
};

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({
  children,
  inactivityTimeoutSeconds = INACTIVITY_TIMEOUT_SECONDS,
  inactivityNavigateTo = '/',
  enableInactivity = !isTest,
}) => {
  const location = useLocation();

  const defaults = useMemo(
    () => getDefaultSettings(location.search),
    [location.search]
  );

  const defaultSettingsRef = useRef(defaults);
  useEffect(() => {
    defaultSettingsRef.current = defaults;
  }, [defaults]);

  const [settings, setSettings] = useState(defaults);
  const [resetTrigger, setResetTrigger] = useState(0);

  const restoreDefaults = useCallback(() => {
    // console.log('Restoring default settings due to inactivity');
    setSettings(defaultSettingsRef.current);
    setResetTrigger(prev => prev + 1);
  }, []);

  usePersistSettings(settings);

  useInactivity({
    restoreDefaults,
    timeout: inactivityTimeoutSeconds,
    navigateTo: inactivityNavigateTo,
    enabled: enableInactivity && inactivityTimeoutSeconds > 0,
  });

  useEffect(() => {
    if (i18n.language !== settings.lang) {
      i18n.changeLanguage(settings.lang);
    }
  }, [settings.lang]);

  return (
    <AppSettingsContext.Provider
      value={{ settings, setSettings, resetTrigger }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsContext;
