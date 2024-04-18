import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons' 

const getAllPersons = () => {
    const promise = axios.get(baseUrl)
    return promise.then(response => response.data)
}

const addPerson = (person) => {
    const promise = axios.post(baseUrl, person)
    return promise.then(response => response.data)
}

const deletePerson = (id) => {
    const promise = axios.delete(`${baseUrl}/${id}`)
    return promise.then(response => response.data)
}

const changePerson = (person) => {
    const promise = axios.put(`${baseUrl}/${person.id}`, person)
    return promise.then(response => response.data)
}

export default { getAllPersons, addPerson, deletePerson, changePerson }