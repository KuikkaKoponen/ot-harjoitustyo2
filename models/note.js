// Tietokantaan yhdeydenottaminen ja skeeman tekeminen

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false) // tämä rooli jäi auki
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI // tämä saadaan .env kansiosta

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true 
  },
  number: { 
    type: String,
    minlength: 8,
    required: true
  }, 
})

/// KORJAA
noteSchema.plugin(uniqueValidator)

// Tällä muokataan mongosta palaavaa notea, siitä otetaan _id ja __v pois. Id palautetaan sitten normaalissa muodossa
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)