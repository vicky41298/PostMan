const express = require('express'),
      router = express.Router()

const storage = require('node-persist');

let notes = [];

(async function() {
  await Promise.resolve(storage.init());
  persistedNotes = await storage.getItem('notes')
  console.log(`NOTES: ${persistedNotes.length}`)
  if (persistedNotes.length > 0) {
    notes = persistedNotes
  }
}());

async function persistNotes() {
  await storage.updateItem('notes', notes)
}

router
  .get('/', async (req, res) => {
    res.send(notes)
  })
  .get('/:key/', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.params.key)

    if (req.params.key && indexOfNote !== -1) {
      res.send(notes[indexOfNote])
    } else {  
      res.send(`A note by the name of ${req.params.key} could not be found.`)
    }
  })
  .post('/createNote', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.body.key)

    if (indexOfNote == -1 && req.body.key && req.body.date && req.body.text ) {
      notes.push({
        id: notes.length | 0,
        ...req.body
      })
      console.log(notes)
      res.send(`A note by the name of ${req.body.key} was saved.`)
    } else if (indexOfNote !== -1 ) {
      res.send(`A note with the key ${req.body.key} is already saved.`)
    } else {
      res.send('A required field was missing.')
    }

    persistNotes()
  })
  .get('/deleteNote', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.body.key)

    if (req.body.key && indexOfNote !== -1) {
      notes.splice(indexOfNote, 1)
      res.send(`A note by the name of ${req.body.key} was deleted.`)
    } else {  
      console.log(`A note by the name of ${req.body.key} could not be found.`)
      res.send(`A note by the name of ${req.body.key} could not be found.`)
    }

    persistNotes()
  })
  .get('/:key/deleteNote', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.params.key)

    if (req.params.key && indexOfNote !== -1) {
      notes.splice(indexOfNote, 1)
      res.send(`A note by the name of ${req.params.key} was deleted.`)
    } else {  
      console.log(`A note by the name of ${req.params.key} could not be found.`)
      res.send(`A note by the name of ${req.params.key} could not be found.`)
    }

    persistNotes()
  })
  .put('/updateNote', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.body.key)

    if (req.body.key && indexOfNote !== -1) {
      notes.splice(indexOfNote, 1, {
        id: notes.length | 0,
        ...req.body
      })
      res.send(`A note by the name of ${req.body.key} was updated.`)
    } else {  
      console.log(`A note by the name of ${req.body.key} could not be found.`)
      res.send(`A note by the name of ${req.body.key} could not be found.`)
    }

    persistNotes()
  })
  .put('/:key/updateNote', async (req, res) => {
    indexOfNote = notes.findIndex(note => note.key === req.params.key)

    if (req.params.key && indexOfNote !== -1) {
      notes.splice(indexOfNote, 1, {
        id: notes.length | 0,
        ...req.body
      })
      res.send(`A note by the name of ${req.params.key} was updated.`)
    } else {  
      console.log(`A note by the name of ${req.params.key} could not be found.`)
      res.send(`A note by the name of ${req.params.key} could not be found.`)
    }

    persistNotes()
  })

module.exports = router;