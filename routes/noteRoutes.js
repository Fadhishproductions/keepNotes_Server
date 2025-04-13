import express from 'express'
import { createNotes, getNotes, reOrder } from '../controllers/noteController.js'
 
const router = express.Router()

router.get('/',getNotes)
router.post('/',createNotes)
router.put('/reorder',reOrder)

export default router