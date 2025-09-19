import axios from 'axios'

const baseUrl = '/api/files'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const upload = async fileObject => {
  const response = await axios.post(baseUrl, fileObject)
  return response.data
}

const remove = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}
const getById = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, upload, remove, getById }