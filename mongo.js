
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackk:${password}@cluster0.iqm7nut.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true
  },
  number:
  {
    type: String,
    minLength: 8,
    maxLength: 30,
    required: true,
    validate : {
      validator : function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message : props => `${props.value} is not a valid phone number!`
    }
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log('Person saved!')
    Person.find({}).then(updatedResult => {
      console.log('Updated list of persons:')
      updatedResult.forEach(updatedPerson => {
        console.log(updatedPerson)
      })
      mongoose.connection.close()
    })
  })
} else {
  console.log('Invalid input. Please provide a password, or a password, name, and number.')
  mongoose.connection.close()
}



