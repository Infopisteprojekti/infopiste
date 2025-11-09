import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuService from '@/services/unicafe.js';

import '@/styles/components/UnicafeMenu.css';

const UnicafeMenu = () => {
  const { i18n } = useTranslation();
  const [menus, setMenus] = useState(null);
  const [lastFetchDate, setLastFetchDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodayString = () => {
    const today = new Date();

    today.setDate(today.getDate() + 1);

    const todayStr = today
      .toLocaleDateString('fi-FI', {
        day: '2-digit',
        month: '2-digit',
      })
      .replace('/', '.');
    return todayStr;
  };

  useEffect(() => {
    const today = getTodayString();

    if (!menus || lastFetchDate !== today) {
      setLoading(true);
      MenuService.getMenus()
        .then(data => {
          setMenus(data['data']);
          setLastFetchDate(today);
          console.log(data);
        })
        .catch(err => setError(err.message || 'Error fetching menus'))
        .finally(() => setLoading(false));
    }
  }, [menus, lastFetchDate]);

  if (loading) return <div>Loading menus...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menus) return <div>No menus available.</div>;

  const menuForLang = menus[i18n.language] || menus['fi'];

  return (
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
                      {item.meta?.map((tag, idx) => (
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
  );
};

export default UnicafeMenu;
