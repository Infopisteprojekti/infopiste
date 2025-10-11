import { Routes, Route, Link } from 'react-router-dom';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';

import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="navbar">
        <Link className="navbar-button" to="/">
          {t('navbar.floorplan')}
        </Link>
        <Link className="navbar-button" to="/board">
          {t('navbar.bulletinboard')}
        </Link>
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
