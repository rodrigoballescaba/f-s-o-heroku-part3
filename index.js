import Person from './models/person.js'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

// Constants
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// Endpoints
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => response.json(persons)).catch(error => next(error))
})

app.get('/info', async (request, response, next) => {
  let personsArray = []

  await Person.find({}).then(persons => personsArray.push(...persons)).catch(error => next(error))

  response.send(`<p>Phonebook has info for ${personsArray.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => updatedPerson.toJSON())
    .then(updatedAndFormattedPerson => {
      response.json(updatedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(_ => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Middleware Unknown Endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Middleware Error Handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Listen Port
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})