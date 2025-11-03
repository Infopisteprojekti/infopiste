import axios from 'axios';
const baseUrl = '/api/forms';

const getForms = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getForms };
