
import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'
import { Persons, PersonForm, Phonebook, Notification } from './components/Phonebook'


const App = () => {


  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [persons, setPersons] = useState([])
  const [showAll, setShowAll] = useState(persons)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(() => {

    phonebookService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)

      })


  }, [])


  const deletePerson = id => {

    const personToDelete = persons.find(p => p.id === id)
    const confirmDelete = `Do you really want to delete ${personToDelete.name} ?`

    if (window.confirm(confirmDelete)) {

      phonebookService
        .deleteObj(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error("Error deleting person:", error);
        })
    }

  }




  const addPerson = (event) => {

    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)


    if (existingPerson && existingPerson.number === newNumber) {
      alert(`${newName} is already added to the phonebook`)
    }
    else if (existingPerson && existingPerson.number !== newNumber) {
      const confirmUpdate = `${newName} is already in the phonebook, replace the old number with a new one?`

      if (window.confirm(confirmUpdate)) {

        const id = existingPerson.id

        const updatedPerson =
        {
          name: existingPerson.name,
          id: id,
          number: newNumber
        }


        phonebookService
        .update(id, updatedPerson)
        .then(returnedPerson => {
          const updatedPersons = persons.map(person => (person.id !== id ? person : returnedPerson))
          setPersons(updatedPersons)
          setnewNumber('')
        })
        .catch(error => {
        
          console.log(error.response.data.error)

          setErrorMessage(

            `${error.response.data.error}`

          )


          setTimeout(() => {

            setErrorMessage(null)

          }, 5000)



        })
        
        
      }


    }

    else {

      const nameObj = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }

      phonebookService
        .create(nameObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setnewNumber('')
          setShowAll(persons.concat(returnedPerson))
          setMessage(

            `Added '${newName}'.`
    
          )
    
          setTimeout(() => {
    
            setMessage(null)
    
          }, 5000)

        })
        .catch(error => {
        
          console.log(error)

          setErrorMessage(

            `${error.response.data.error}`

          )


          setTimeout(() => {

            setErrorMessage(null)

          }, 5000)



        })


    }


  }



  const handleNameChange = (event) => {

    setNewName(event.target.value)

  }


  const handleNumChange = (event) => {

    setnewNumber(event.target.value)
  }


  const search = (event) => {

    event.preventDefault()
    console.log('button clicked', event.target)

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newName.toLowerCase()))

    setShowAll(personsToShow)
    setNewName('')

  }


  return (
    <div>
      <h1>PhoneBook</h1>
      <Phonebook newName={newName} handleNameChange={handleNameChange} showAll={showAll} search={search} />
      <h2>add new</h2>
      <Notification message={message} />
      <PersonForm
        errorMessage={errorMessage}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumChange={handleNumChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons}
        deletePerson={deletePerson} />
    </div>
  )


}


export default App
