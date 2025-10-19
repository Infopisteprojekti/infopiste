import axios from 'axios';
const baseurl = '/api/rooms'

const getRooms = async () => {
  const response = await axios.get(baseurl)
  return response.data
}

export default { getRooms };