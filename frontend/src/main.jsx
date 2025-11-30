import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import App from '@/App.jsx';
import '@/utils/i18n';
import '@/styles/index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <AppSettingsProvider inactivityTimeoutSeconds={60} inactivityNavigateTo="/">
      <App />
    </AppSettingsProvider>
  </Router>
);
