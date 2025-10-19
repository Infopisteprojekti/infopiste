import axios from 'axios';
const baseurl = '/api/reservations';

const getReservations = async () => {
  const response = await axios.get(baseurl);
  return response.data;
};

export default { getReservations };
