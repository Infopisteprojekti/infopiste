import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuService from '@/services/unicafe.js';

import '@/styles/components/UnicafeMenu.css';

const UnicafeMenu = () => {
  const { t, i18n } = useTranslation();
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) return <div>Loading menus...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menus) return <div>No menus available.</div>;

  const menuForLang = menus[i18n.language] || menus['fi'];

  return (
    <div className="unicafe-wrapper">
      <div className="menu-container">
        {menuForLang.length === 0 ? (
          <div className="no-menu">{t('unicafe.no-menus')}</div>
        ) : (
          menuForLang.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              <h2>{restaurant.name}</h2>
              {restaurant.menu.length === 0 ? (
                <div className="no-menu">{t('unicafe.no-menu-restaurant')}</div>
              ) : (
                <div className="menu-items">
                  {restaurant.menu.map((item, index) => (
                    <div key={index} className="menu-card">
                      <h3>{item.name}</h3>
                      <div className="meta-tags">
                        {item.meta
                          ?.filter(tag => tag !== 'M')
                          .map((tag, idx) => (
                            <span key={idx} className="meta-tag">
                              {tag}
                            </span>
                          ))}
                      </div>
                      <p className="price-name">{item.priceName}</p>
                    </div>
                  ))}
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
