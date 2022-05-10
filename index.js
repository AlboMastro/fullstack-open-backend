require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan('tiny'));

const Person = require('./models/person')

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  }) 
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.post("/api/persons", morgan(':body'), (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name and/or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  });


  person.save()
    .then(savedPerson => {
    response.json(savedPerson)
  })
});

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})