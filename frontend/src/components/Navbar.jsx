import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import { useTranslation } from 'react-i18next';
import '@/styles/components/Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();

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
      <LanguageSwitcher />
    </div>
  );
};

export default Navbar;
