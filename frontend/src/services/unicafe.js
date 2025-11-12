import axios from 'axios';
const baseUrl = '/api/unicafe';

const getMenus = async lang => {
  const response = await axios.get(`${baseUrl}/menus`, {
    params: { lang },
  });
  return response.data;
};

export default { getMenus };
