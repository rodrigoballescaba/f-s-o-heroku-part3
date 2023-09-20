import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = mongoose.Schema({
    name: { 
      type: String,
      minlength: 5,
      required: true,
      unique: true
    },
    number: { 
      type: String,
      minlength: 9,
      required: true
    },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person', personSchema)