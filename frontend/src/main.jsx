import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App.jsx';
import '@/utils/i18n';
import '@/styles/index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
