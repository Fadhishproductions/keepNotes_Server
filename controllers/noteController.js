import Note from '../models/note.js';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/AppError.js';


const capitalizeFirstLetter = (text) => {
  return text?.charAt(0).toUpperCase() + text?.slice(1);
};

export const getNotes = asyncHandler(async (req,res)=>{
const notes = await Note.find().sort({position:1})
res.json(notes)
})

export const createNotes =  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title?.trim() && !content?.trim()) {
      throw new AppError('Note title or content is required', 400);
    }
    const count = await Note.countDocuments();
    const titleFormatted = capitalizeFirstLetter(title?.trim());
    const contentFormatted = content?.trim();
    const newNote = new Note({ title :titleFormatted, content:contentFormatted, position: count });
    await newNote.save();
    res.status(201).json(newNote);
  })

  //ReOrder the notes
  export const reOrder = asyncHandler(async (req, res) => {
    const { reorderedNotes } = req.body;

    if (!Array.isArray(reorderedNotes) || reorderedNotes.length === 0) {
      throw new AppError('Reordered notes list is invalid or empty', 400);
    }

    for (let i = 0; i < reorderedNotes.length; i++) {
      await Note.findByIdAndUpdate(reorderedNotes[i]._id, { position: i });
    }
    res.json({ message: "Reordered successfully" });
  })

  //Update the Notes
  export const updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title?.trim() && !content?.trim()) {
      throw new AppError('Title or content is required', 400);
    }
    
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );
  
      if (!updatedNote) throw new AppError('Note not found', 404);
  
      res.json(updatedNote);
    
  });
  
  export const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
   
      const deleted = await Note.findByIdAndDelete(id);
      if (!deleted) throw new AppError('Note not found', 404);
  
      res.json({ message: "Note deleted successfully" });
    
  });
  
 