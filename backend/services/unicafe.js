const UNICAFE_API_BASEURL = 'https://unicafe.fi/wp-json/swiss/v1/restaurants/';
const MENU_LANGS = ['fi', 'en', 'sv'];
const RESTAURANTS = ['chemicum', 'exactum'];

function simplifyMenu(menuItems = []) {
  return menuItems.map(item => ({
    name: item.name,
    meta: item.meta?.[0] || [],
    priceName: item.price?.name || null,
  }));
}

export async function fetchMenuData() {
  try {
    const responses = await Promise.all(
      MENU_LANGS.map(lang => fetch(`${UNICAFE_API_BASEURL}?lang=${lang}`))
    );

    responses.forEach((res, i) => {
      if (!res.ok) {
        throw new Error(
          `Failed to fetch Unicafe data for lang=${MENU_LANGS[i]} (status: ${res.status})`
        );
      }
    });

    const data = await Promise.all(responses.map(res => res.json()));

    const today = new Date();
    const todayStr = today
      .toLocaleDateString('fi-FI', {
        day: '2-digit',
        month: '2-digit',
      })
      .replace('/', '.');

    const filterMenu = restaurants => {
      return restaurants
        .filter(r => RESTAURANTS.includes(r.slug))
        .map(r => {
          const todayMenu = r.menuData?.menus?.find(m => {
            const datePart = m.date?.split(' ')[1];
            return datePart === todayStr;
          });

          return {
            id: r.id,
            name: r.title,
            slug: r.slug,
            address: r.address,
            date: todayMenu?.date || null,
            menu: simplifyMenu(todayMenu?.data || []),
          };
        });
    };

    const filteredByLang = {};
    MENU_LANGS.forEach((lang, idx) => {
      filteredByLang[lang] = filterMenu(data[idx]);
    });

    return filteredByLang;
  } catch (err) {
    console.error('Error fetching or filtering Unicafe data:', err);
    throw new Error(err);
  }
}
