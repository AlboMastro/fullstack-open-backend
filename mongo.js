const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://AlboMastro:${password}@hellocluster.r8b64.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

process.argv.forEach((name, number) => {

  name = process.argv[3];
  number = process.argv[4];
  mongoose.connect(url)

  const person = new Person({
    id: Number,
    name: name,
    number: number,
    date: new Date()
  })

  person.save()
    .then(result => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}) 

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });