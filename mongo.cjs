const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://rodrigoballescaba:${password}@fso.z3udzcs.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 5) {
  console.log('Please provide the number and name as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

if (process.argv.length == 5) {
  const name = process.argv[3]
  const phone = process.argv[4]

  const person = Person({
    name: name,
    number: phone
  })
  
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}



