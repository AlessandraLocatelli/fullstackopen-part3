import React from 'react';



const Persons = ({ persons, deletePerson }) => {

  return (


    <ul>
      {
        persons.map(person =>

          <li key={person.id}>{person.name} - {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>

        )


      }

    </ul>


  )

}




const PersonForm = ({ newName, handleNameChange, newNumber, handleNumChange, addPerson, errorMessage }) => {

  const error = {

    color: 'red',
    background: 'lightgrey',
    fontSize: 15,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10


  }


  return (

    <form onSubmit={addPerson}>

      {errorMessage !== null && (
        <div style={error}>
          {errorMessage}
        </div>
      )}

      <div>
        name: <input value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input value={newNumber}
          onChange={handleNumChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}



const Phonebook = ({ newName, handleNameChange, showAll, search }) => {


  return (
    <>
      <form onSubmit={search}>
        filter shown with:
        <input value={newName} onChange={handleNameChange} />
        <button type="submit">search</button>
      </form>

      <ul>
        {showAll.map((person) => (
          <li key={person.id}>
            {person.name} - {person.number}
          </li>
        ))}
      </ul>
    </>
  )
}


const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (

    <div className="success">
      {message}
    </div>

  )


}


export { Persons, PersonForm, Phonebook, Notification }
