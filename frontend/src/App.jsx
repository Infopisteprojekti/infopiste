import { Routes, Route, Link } from 'react-router-dom';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';
import { ChevronUp } from 'lucide-react';

import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="navbar">
        <Link className="navbar-button" to="/">
          {t('navbar.floorplan')}
        </Link>
        <Link className="navbar-button" to="/board">
          {t('navbar.bulletinboard')}
        </Link>
        <div className="navbar-language-switcher">
          <select
            value={i18n.resolvedLanguage}
            onChange={e => changeLanguage(e.target.value)}
          >
            <option value="fi">Finnish</option>
            <option value="en">English</option>
            <option value="sv">Swedish</option>
          </select>
        </div>
      </div>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Floorplan />
              </div>
            }
          />
          <Route path="/board" element={<BulletinBoard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
