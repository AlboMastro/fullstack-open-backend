const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://AlboMastro:${password}@hellocluster.r8b64.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
    date: new Date(),
  });

  person.save()
    .then(result => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook`)
    mongoose.connection.close()
  });

} else if (process.argv.length === 3) {
  
  Person.find({})
  .then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    });
  mongoose.connection.close()
  })
}

