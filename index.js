require('dotenv').config() // hakee ympäristömuuttujat tiedosta
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

app.use(cors()) // liittyy, että Front ja Back voi toimia eri porteista
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))  // tämä näyttää consoliin logeja
app.use(express.static('build')) // tämä liittyy siihen, että käytetään staattista Fronttia. Back palauttaa Frontin build kansiosta kun mennään pääsivulle
app.use(express.json()) 

// tässä lisätää lokiin sisältö jos POST tai PUT pyyntö
morgan.token('content', (request, response) => {
  if(request.method === 'POST' || request.method === 'PUT') {
    return JSON.stringify(request.body)
  }
})

// toimii
app.get('/api/persons', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

// toimii
app.get('/api/persons/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// toimii
app.get('/info', (req, res) => {
  var size = 0
  // luulisi, että löytyy koon kertova pyyntö
  Note.find({}).then(notes => {
    size = notes.length  
  const date = Date()
  res.send(`<p>Phonebook has info for ${size} people</p> </br> ${date}`)
  })  
})

// toimii
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)
  
  /*
  if (!body.name ) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number ) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  */

  const note = new Note({
    name: body.name,
    number: body.number
  })

  // alla hienosti ketjutetaan formaatit oikeaan muotoon
  note
  .save()
  .then(savedNote => savedNote.toJSON())
  .then(savedAndFormattedNote => {
    response.json(savedAndFormattedNote)
  }) 
  .catch(error => next(error))
})

// toimii
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number,
  }

  // huom! metodin findByIdAndUpdate parametrina tulee antaa normaali Javascript-olio
  Note.findByIdAndUpdate(request.params.id, note, { new: true }) // true palauttaa päivitetyn olion (normisti vanha)
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

// toimii
app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely middleware
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// virheellisten pyyntöjen käsittely middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})