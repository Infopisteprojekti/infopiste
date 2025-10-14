import { Routes, Route, Link } from 'react-router-dom';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';

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
        <LanguageSwitcher i18n={i18n} changeLanguage={changeLanguage} />
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
