import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './css/index.css';
import './css/reset.css';


createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
);
