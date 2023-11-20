
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const app = express()
app.use(cors())

morgan.token('type', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms:type'))
app.use(express.static('dist'))
app.use(express.json())


app.get('/persons', (request, response, next) => {

  Person
    .find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))

})



app.get('/persons/:id', (request, response, next) => {

  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {

  Person
    .countDocuments({})
    .then(numOfPeople => {
      const timeOfRequest = new Date()

      response.send(
        `
    <div>
      <p>PhoneBook has info for ${numOfPeople} people</p>
      <br />
      <p>${timeOfRequest}</p>
    </div>
  `)

    })
    .catch(error => next(error))

})



app.delete('/persons/:id', (request, response, next) => {

  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(404).end()

    })
    .catch(error => next(error))

})


app.post('/persons', async (request, response, next) => {
  const body = request.body

  try {
    const existingPerson = await Person.findOne({ name: body.name })

    if (existingPerson) {
      const isValidNum = /^\d{2,3}-\d+$/.test(body.number)
      const isValidName = body.name.length >= 3 && body.name.length <= 30

      if (!isValidNum || !isValidName) {
        return response.status(400).json({
          error: 'Invalid name or number format.'
        })
      }

      if (existingPerson.number !== body.number) {
        return Person.findOneAndUpdate(
          { name: body.name },
          { number: body.number },
          { new: true, runValidators: true, context: 'query' }
        )
      } else {
        return response.status(404).json({
          error: 'user already present'
        })
      }
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      await person.validate()

      return person.save()
    }
  } catch (error) {
    console.error('Validation Error:', error.errors)
    next(error)
  }
})



app.put('/persons/:id', async (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const isValidNum = /^\d{2,3}-\d+$/.test(body.number)
  const isValidName = body.name.length >= 3 && body.name.length <= 30

  if (!isValidNum || !isValidName) {
    return response.status(400).json({
      error: 'Invalid name or phone number format'
    })
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedPerson) {
      return response.status(404).json({
        error: 'Person not found'
      })
    }

    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})



const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(404).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


morgan((tokens, req, res) => {

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})