const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
  
morgan.token('content', (request, response) => {
  if(request.method === 'POST' || request.method === 'PUT') {
    return JSON.stringify(request.body)
  }
})

let notes = [
  {
    id: 1,
    name: "Kalle",
    number: "0202020202"
  },
  {
    id: 2,
    name: "Ville",
    number: "214123421341234"
  },
  {
    id: 3,
    name: "Nakki",
    number: "34623623462467246"

  }
]

app.get('/api/persons/:id', (request, response) => {
    console.log("GET request")
    const id = Number(request.params.id)  // muutetaan numero muotoon
    console.log(id)
    const note = notes.find(note => note.id === id)

    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    } 
  })
  
  
  app.get('/', (req, res) => {
    res.send('<h1>Täältä voi hakea ihmisiä</h1>')
  })
  app.get('/info', (req, res) => {
    const date = Date()
    res.send(`<p>Phonebook has info for ${notes.length} people</p> </br> ${date}`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(notes)
  })

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  
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

  const nameUsed = notes.find(note => note.name == body.name)
  if (nameUsed) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const note = {
    id: Math.floor(Math.random() * 500),
    name: body.name,
    number: body.number || 0
    
  }

  notes = notes.concat(note)

  response.json(note)
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const id = Number(request.params.id)
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id == id) {
        notes[i].name = body.name
        notes[i].number = body.number
        console.log('Päivitetty')
        return response.json(body)
    }
  }

  return response.status(400).json({ 
    error: 'Person not found' 
  })


})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})