
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@cluster0-zyt1p.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length<4) {
    console.log('Retrieving all data')
    Note.find({}).then(result => {
        console.log('Phonebook')
        result.forEach(note => {
          console.log(note.name, note.number)
        })
        mongoose.connection.close()
      })
}

else if (process.argv.length<5) { 
    console.log('Too few arguments to add data')
    process.exit(1)
}

else if (process.argv.length<6) {
    const note = new Note({
        name: process.argv[3],
        number: process.argv[4],
      })
      note.save().then(response => {
        console.log('note saved!')
        mongoose.connection.close()
      }) 
}
