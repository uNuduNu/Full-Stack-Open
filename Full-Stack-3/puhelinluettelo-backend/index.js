require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('bodyM', function getBody(req){
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyM'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  Person.find({}).then(persons => {
    const currentDate = new Date()

    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${currentDate.toDateString()} ${currentDate.toTimeString()}</div>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person === undefined) {
        response.status(404).end()
      }
      else {
        response.send(`<div>Name: ${person.name}</div><div>Number: ${person.number}</div`)
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if(body === undefined || body.name === undefined || body.number === undefined){
    const error = body === undefined ? 'Content missing' : body.name === undefined ? 'name missing' : 'number missing'
    return response.status(400).json({
      error: error
    })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(body === undefined || body.name === undefined || body.number === undefined){
    const error = body === undefined ? 'Content missing' : body.name === undefined ? 'name missing' : 'number missing'
    return response.status(400).json({
      error: error
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


