import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getPersons = () => {
    return axios
      .get(baseUrl)
      .then(response => response.data)
}

const updatePersons = (newPerson) => {
    return axios
      .post(baseUrl, newPerson)
      .then(response => response.data)
}

const deletePerson = (id) => {
    return axios
      .delete(`${baseUrl}/${id}`)
      .then(response => response.data)
}

export default {
    getPersons: getPersons,
    updatePersons: updatePersons,
    deletePerson: deletePerson
}

