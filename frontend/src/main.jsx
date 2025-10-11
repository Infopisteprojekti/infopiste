import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import '../utils/i18n.js';
import './css/reset.css';
import './css/index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
