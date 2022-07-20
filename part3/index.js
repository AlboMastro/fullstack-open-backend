require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan('tiny'))


const Person = require('./models/person')
const { model } = require('mongoose')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    switch (error.name) {
    case 'CastError':
        return response
            .status(400)
            .send({ error: 'malformatted id' })
        break
    case 'ValidationError':
        return response
            .status(400)
            .json({ error: error.message })
        break
    case 'ParallelSaveError':
        return response
            .status(409)
            .send({ error: 'conflict error' })
        break
    case 'MongooseError':
        return response
            .status(500)
            .send({ error: 'there was an error' })
    default:
        return response
            .status(500)
            .send('Something went wrong')
    }
    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then((person) => {
        response.json(person)
        console.log(person.length)
    })

})

app.get('/api/info', (request, response) => {
    Person.estimatedDocumentCount((err, count) => {
        response.send(`
    <p> Phonebook has info for ${count} people </p>
      ${new Date()}
    `)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', morgan(':body'), (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name and/or number missing',
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date()
    })


    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })

        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch((error) => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
