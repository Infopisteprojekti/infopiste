import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSettings } from '@/hooks/useAppSettings';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import '@/styles/components/Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const { settings } = useAppSettings();
  const location = useLocation();

  const isActive = path => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="navbar">
      <Link className={`nav-button button ${isActive('/')}`} to="/">
        {t('navbar.floorplan')}
      </Link>
      <Link className={`nav-button button ${isActive('/board')}`} to="/board">
        {t('navbar.bulletinboard')}
      </Link>
      <Link
        className={`nav-button button ${isActive('/unicafe')}`}
        to="/unicafe"
      >
        {t('navbar.unicafe')}
      </Link>

      {settings.loading && <span className="loader"></span>}

      <LanguageSwitcher />
    </div>
  );
};

export default Navbar;
