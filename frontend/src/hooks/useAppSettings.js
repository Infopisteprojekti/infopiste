import { useContext } from 'react';
import AppSettingsContext from '@/context/AppSettingsContext';

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('Context not initialized');
  }
  return context;
};
