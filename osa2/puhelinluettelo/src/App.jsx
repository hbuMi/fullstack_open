import { useEffect, useState } from 'react'
import personService from './services/server_com'
import Notification from './components/notification'

const Filter = ({ value, onChange }) => (
  <form>
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  </form>
)

const PersonForm = ({
  name,
  number,
  onNameChange,
  onNumberChange,
  onSubmit
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={number} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person)}>delete</button>
      </li>
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const nameChange = (event) => {
    setNewName(event.target.value)
  }

  const numberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)

    if (names.includes(newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }

    personService
      .updatePersons({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(currentPersons => currentPersons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${newName}`)
        setTimeout(() =>  {
          setNotification(null)
        }, 3000)
      })
      .catch(error => {
        console.error('Error adding person:', error)
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personService
      .deletePerson(person.id)
      .then(() => {
        setPersons(currentPersons => currentPersons.filter(p => p.id !== person.id))
        setNotification(`${person.name} removed`)
        setTimeout(() =>  {
          setNotification(null)
        }, 3000)
      })
      .catch(error => {
        console.error('Error deleting person:', error)
      })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter value={newFilter} onChange={filterChange} />
      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={nameChange}
        onNumberChange={numberChange}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App