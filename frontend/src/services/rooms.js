import axios from 'axios';
const baseUrl = '/api/rooms';

const getRooms = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getRooms };
