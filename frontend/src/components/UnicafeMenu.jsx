import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import MenuService from '@/services/unicafe.js';
import '@/styles/components/UnicafeMenu.css';
import '@/styles/components/Button.css';

const UnicafeMenu = () => {
  const { t, i18n } = useTranslation();
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState('Exactum');

  useEffect(() => {
    if (!menus) {
      setLoading(true);
      MenuService.getMenus()
        .then(data => {
          const menusData = data['data'];
          setMenus(menusData);
        })
        .catch(err => setError(err.message || 'Error fetching menus'))
        .finally(() => setLoading(false));
    }
  }, [menus]);

  if (loading || error || !menus) {
    return (
      <div className="loading-menu">
        {loading && <span className="loader"></span>}
        <p>
          {loading
            ? t('unicafe.loading-menus')
            : error
              ? `Error: ${error}`
              : t('unicafe.no-menus')}
        </p>
      </div>
    );
  }

  const menuForLang = menus[i18n.language] || menus['fi'];
  const selectedData = menuForLang.find(r => r.name === selectedRestaurant);

  return (
    <div className="unicafe-wrapper">
      <div className="restaurant-selector">
        {menuForLang.map(r => (
          <button
            key={r.name}
            className={`button ${
              selectedRestaurant === r.name ? 'active' : ''
            }`}
            onClick={() => setSelectedRestaurant(r.name)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="three-grid fade-container" key={selectedRestaurant}>
        {selectedData.menu.length === 0 ? (
          <div className="no-menu">{t('unicafe.no-menu-restaurant')}</div>
        ) : (
          selectedData.menu.map((item, index) => (
            <div key={index} className="menu-card">
              <div className="price-label">
                {t(`price-names.${item.priceName}`, item.priceName)}
              </div>

              <h3 className="menu-name">{item.name}</h3>

              <div className="meta-tags">
                {item.tags
                  ?.filter(tag => tag !== 'M')
                  .map((tag, idx) => (
                    <span key={idx} className="meta-tag">
                      {tag}
                    </span>
                  ))}
              </div>

              {item.ilmastovalinta && (
                <div className="climate-choice">
                  {t('unicafe.climate-choice', 'Ilmastovalinta')}
                </div>
              )}

              {item.includes?.length > 0 && (
                <div className="includes">
                  <strong>{t('unicafe.includes', 'Sisältää')}:</strong>{' '}
                  {item.includes.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="menu-footer">
        <small>{t('unicafe.menus-source')}</small>
      </div>
    </div>
  );
};

export default UnicafeMenu;
