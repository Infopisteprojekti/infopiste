import axios from 'axios';
const baseUrl = '/api/reservations';

const getReservations = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getReservations };
