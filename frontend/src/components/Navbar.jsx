import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useTranslation } from 'react-i18next';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

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
      <LanguageSwitcher i18n={i18n} changeLanguage={changeLanguage} />
    </div>
  );
};

export default Navbar;
