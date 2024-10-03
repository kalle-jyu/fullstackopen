import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  console.log('create a new blog')
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  console.log('update a blog')
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${ baseUrl }/${id}`, newObject, config)
  return request.then(response => response.data)
}

const remove = (id) => {
  console.log('remove a blog')
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${ baseUrl }/${id}`, config)
  return request.then(response => response.data)
}

export default { setToken, getAll, create, update, remove }








