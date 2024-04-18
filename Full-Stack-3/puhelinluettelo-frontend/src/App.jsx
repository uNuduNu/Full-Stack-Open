import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({value, handler}) => <Input name="filter shown with" value={value} handler={handler}/>

const Input = ({name, value, handler}) => <div>{name} <input value={value} onChange={handler}/></div>

const AddPerson = ({submitHandler, nameValue, nameHandler, numberValue, numberHandler}) => {
  return (
    <form onSubmit={submitHandler}>
    <Input name="Name:" value={nameValue} handler={nameHandler}/>
    <Input name="Number:" value={numberValue} handler={numberHandler}/>
    <div>
      <button type="Submit">add</button>
    </div>
  </form>
  )
}

const Person = ({name, number, id, removeHandler}) => <p>{name} {number} <button onClick={() =>removeHandler(name, id)}>delete</button></p>

const Persons = ({persons, removeHandler}) => {
  if (persons === undefined){
    return null
  }
  return (
    <div>
      {persons.map(person => <Person key={person.name} name={person.name} number={person.number} id={person.id} removeHandler={removeHandler}/>)}
    </div>
  )
}

const StatusMessage = ({text, success}) => {
  if (text === null) {
    return null
  }

  const messsageStyle = {
    color: success ? 'black' : 'red',
    backgroundColor: success ? 'lightgreen' : 'white',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: success ? 1 : 5,
    padding: 5
  }

  return <div style={messsageStyle}>{text}</div>
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(true)

  useEffect(() => {
    personService.getAllPersons()
    .then(persons => setPersons(persons))
    .catch(error => showMessage('Failed to get persons from server', error))
  }, [])

  const showMessage = (text, error) => {
    if (error !== null)
      console.log(error)

    setMessage(text)
    setMessageStatus(error === null)

    setTimeout(() => { 
      setMessage(null)
    }, 5000)
  }

  const removePerson = (name, id) => {
    if (false === window.confirm(`Delete ${name}?`)){
      return
    }
    personService.deletePerson(id)
    .then(result => {
      setPersons(persons.filter(p => p.id !== id))
      showMessage(`Removed ${name}`, null)
    })
    .catch(error => showMessage(`Failed to remove person: ${id}`, error))
  }

  const newPerson = (event) => {
    event.preventDefault()

    if (newName.length === 0){
      return
    }

    const person = {
      name: newName,
      number: newNumber,
    }
 
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson !== undefined){
      if (false === window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)){
        return
      }
      person.id = existingPerson.id

      personService.changePerson(person)
      .then(personServer => {
        setPersons(persons.map(p => p.id !== person.id ? p : personServer))
        showMessage(`Replaced old number for ${personServer.name}`, null)
      })
      .catch(error => {
        showMessage(`Failed to change number of ${newName}: ${error.response.data.error}`, error)
      })
    }
    else {
      personService.addPerson(person)
      .then(personServer => {
        setPersons(persons.concat(personServer))
        showMessage(`Added ${personServer.name}`, null)
      })  
      .catch(error => showMessage(`Failed to add person: ${error.response.data.error}`, error))
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const personsToShow = nameFilter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    <div>
      <StatusMessage text={message} success={messageStatus}/>
      <h2>Phonebook</h2>
      <Filter value={nameFilter} handler={handleNameFilterChange}/>
      <h2>Add a new person</h2>
      <AddPerson submitHandler={newPerson} nameValue={newName} nameHandler={handleNameChange} numberValue={newNumber} numberHandler={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removeHandler={removePerson}/>
    </div>
  )

}

export default App