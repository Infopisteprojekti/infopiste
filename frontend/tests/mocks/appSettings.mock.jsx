import { vi } from 'vitest';

export const setSettingsMock = vi.fn();

let state = {
  settings: { lang: 'en', floor: 1, marker: '10,20' },
  setSettings: setSettingsMock,
  resetTrigger: 0,
};

export const __getAppSettings = () => state;

export const __setAppSettings = partial => {
  state = { ...state, ...partial };
};

export const __resetAppSettings = () => {
  state = {
    settings: { lang: 'en', floor: 1, marker: '10,20' },
    setSettings: setSettingsMock,
    resetTrigger: 0,
  };
  setSettingsMock.mockClear();
};

export const useAppSettings = () => state;

export default { useAppSettings };
