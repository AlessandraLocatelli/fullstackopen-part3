import axios from 'axios'

const getAll = () => {
  const request = axios.get('/persons');
  return request.then(response => response.data);
}



const create = newObject => {

  const request = axios.post('/persons', newObject)
  return request.then(response => response.data)

}

const update = (id, newObject) => {
  const request = axios.put(`/persons/${id}`, newObject)
  return request.then(response => response.data)
    .catch(error => {
      console.error(`Error updating person with ID ${id}:`, error)
      throw error
    })
}


const deleteObj = (id) => {

  const request = axios.delete(`/persons/${id}`)
  return request.then(response => response.data)

}


export default { getAll, create, update, deleteObj }