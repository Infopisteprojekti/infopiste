import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuService from '@/services/unicafe.js';

import '@/styles/components/UnicafeMenu.css';

const UnicafeMenu = () => {
  const { i18n } = useTranslation();
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodayString = () => {
    const today = new Date();
    return today
      .toLocaleDateString('fi-FI', { day: '2-digit', month: '2-digit' })
      .replace('/', '.');
  };

  useEffect(() => {
    const today = getTodayString();
    const storedMenus = localStorage.getItem('unicafeMenus');
    const storedDate = localStorage.getItem('unicafeMenusDate');

    if (storedMenus && storedDate === today) {
      setMenus(JSON.parse(storedMenus));
      return;
    }

    if (!menus) {
      setLoading(true);
      MenuService.getMenus()
        .then(data => {
          const menusData = data['data'];
          setMenus(menusData);
          localStorage.setItem('unicafeMenus', JSON.stringify(menusData));
          localStorage.setItem('unicafeMenusDate', today);
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
          <div className="no-menu">No menus available.</div>
        ) : (
          menuForLang.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              <h2>{restaurant.name}</h2>
              {restaurant.menu.length === 0 ? (
                <div className="no-menu">
                  No menu items available for this restaurant.
                </div>
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
        <small>Menu data provided by Unicafe</small>
      </div>
    </div>
  );
};

export default UnicafeMenu;
