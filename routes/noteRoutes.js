import express from 'express'
import { createNotes, deleteNote, getNotes, reOrder, updateNote } from '../controllers/noteController.js'
 
const router = express.Router()

//to get all notes
router.get('/',getNotes)

//to create new note
router.post('/',createNotes)

//to reorder the note
router.put('/reorder',reOrder)

//to uodate a note
router.put('/:id', updateNote);

//to delete a note
router.delete('/:id', deleteNote);


export default router